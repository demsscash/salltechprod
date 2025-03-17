// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Session } from '@supabase/supabase-js';

// Configuration pour le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Les variables d\'environnement Supabase ne sont pas définies');
}

// Client standard pour l'utilisation côté client et serveur
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});

// Cache pour les vérifications d'authentification
type AuthCache = {
    session: Session | null;
    timestamp: number;
};

let authCache: AuthCache = {
    session: null,
    timestamp: 0
};

// Durée du cache en ms (30 secondes)
const CACHE_DURATION = 30000;

export async function getSessionWithCache() {
    const now = Date.now();

    // Si les données en cache sont valides, retourner le cache
    if (authCache.session !== null && now - authCache.timestamp < CACHE_DURATION) {
        return { data: { session: authCache.session } };
    }

    // Sinon récupérer une nouvelle session
    const response = await supabase.auth.getSession();

    // Mettre à jour le cache
    if (response.data.session) {
        authCache.session = response.data.session;
        authCache.timestamp = now;
    } else {
        authCache.session = null;
        authCache.timestamp = now;
    }

    return response;
}

// Fonction d'aide pour vérifier la connexion Supabase
export async function checkSupabaseConnection() {
    try {
        // Effectuer une requête simple pour vérifier la connexion
        const { data, error, count } = await supabase
            .from('services')
            .select('*', { count: 'exact' })
            .limit(1);

        if (error) {
            console.error('Erreur lors de la vérification de la connexion Supabase:', error);
            return {
                connected: false,
                error: error.message
            };
        }

        return {
            connected: true,
            count,
            data
        };
    } catch (error: any) {
        console.error('Exception lors de la vérification de la connexion Supabase:', error);
        return {
            connected: false,
            error: error?.message || 'Erreur inconnue'
        };
    }
}

// Fonction pour attendre un certain temps avant d'essayer à nouveau
export function backoffRetry<T>(
    fn: (...args: any[]) => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
) {
    return async function (...args: any[]): Promise<T> {
        let retries = 0;
        let delay = initialDelay;

        while (retries < maxRetries) {
            try {
                return await fn(...args);
            } catch (error: any) {
                retries++;

                // Si c'est la dernière tentative ou l'erreur n'est pas liée au rate limit, abandonner
                if (retries >= maxRetries || !(error.message && (
                    error.message.includes('rate limit') ||
                    error.message.includes('too many requests') ||
                    error.message.includes('Request rate limit')
                ))) {
                    throw error;
                }

                console.log(`Tentative ${retries}/${maxRetries} échouée, attente de ${delay}ms avant de réessayer...`);

                // Attendre avant la prochaine tentative
                await new Promise(resolve => setTimeout(resolve, delay));

                // Augmentation exponentielle du temps d'attente entre les tentatives
                delay *= 2;
            }
        }

        throw new Error(`Échec après ${maxRetries} tentatives`);
    };
}

// Fonction d'authentification avec retry
export const signInWithRetry = backoffRetry(
    async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    }
);