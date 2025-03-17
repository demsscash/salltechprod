// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Configuration pour le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client standard pour l'utilisation côté client et serveur
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
    }
});

// Fonction d'aide pour vérifier la connexion Supabase
export async function checkSupabaseConnection() {
    try {
        // Effectuer une requête simple pour vérifier la connexion
        // Utiliser une syntaxe correcte pour le comptage
        const { count, error } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Erreur lors de la vérification de la connexion Supabase:', error);
            return {
                connected: false,
                error: error.message
            };
        }

        return {
            connected: true,
            count
        };
    } catch (error: any) {
        console.error('Exception lors de la vérification de la connexion Supabase:', error);
        return {
            connected: false,
            error: error?.message || 'Erreur inconnue'
        };
    }
}