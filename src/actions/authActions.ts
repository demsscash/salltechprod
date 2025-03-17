'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

interface SignInCredentials {
    email: string;
    password: string;
}

export async function signIn(credentials: SignInCredentials): Promise<{ success: boolean, error?: string }> {
    try {
        const cookieStore = cookies();
        const supabase = createServerActionClient({ cookies: () => cookieStore });

        const { error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Échec de la connexion'
            };
        }

        return { success: true };
    } catch (err: any) {
        console.error('Erreur lors de la connexion:', err);
        return {
            success: false,
            error: 'Une erreur inattendue s\'est produite'
        };
    }
}

export async function signOut(): Promise<{ success: boolean, error?: string }> {
    try {
        const cookieStore = cookies();
        const supabase = createServerActionClient({ cookies: () => cookieStore });

        const { error } = await supabase.auth.signOut();

        if (error) {
            return {
                success: false,
                error: error.message || 'Échec de la déconnexion'
            };
        }

        return { success: true };
    } catch (err: any) {
        console.error('Erreur lors de la déconnexion:', err);
        return {
            success: false,
            error: 'Une erreur inattendue s\'est produite'
        };
    }
}

// Fonction throttlée pour les vérifications d'authentification côté serveur
let lastCheck = 0;
let cachedUser: User | null = null;
const THROTTLE_INTERVAL = 5000; // 5 secondes

export async function getCurrentUser(): Promise<User | null> {
    try {
        const now = Date.now();

        // Vérifier si on peut utiliser le cache
        if (now - lastCheck < THROTTLE_INTERVAL && cachedUser !== undefined) {
            return cachedUser;
        }

        const cookieStore = cookies();
        const supabase = createServerActionClient({ cookies: () => cookieStore });

        const { data, error } = await supabase.auth.getSession();

        // Mettre à jour le cache
        lastCheck = now;

        if (error || !data.session) {
            cachedUser = null;
            return null;
        }

        cachedUser = data.session.user;
        return data.session.user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
    }
}

export async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    return user;
}