// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Configuration pour le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Les variables d\'environnement Supabase ne sont pas définies');
}

// Client standard pour l'utilisation côté client et serveur
export const supabase = createClient(supabaseUrl, supabaseKey);

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