'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

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

export async function getCurrentUser() {
    try {
        const cookieStore = cookies();
        const supabase = createServerActionClient({ cookies: () => cookieStore });

        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
            return null;
        }

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