import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variables d\'environnement Supabase manquantes');
}

// Limiter les tentatives de connexion par IP
const loginAttempts = new Map<string, { count: number; timestamp: number }>();
const MAX_ATTEMPTS = 5;
const RESET_PERIOD = 5 * 60 * 1000; // 5 minutes
const MIN_ATTEMPT_INTERVAL = 5000; // 5 secondes minimum entre les tentatives

export async function POST(request: NextRequest) {
    try {
        // Récupérer l'IP du client
        const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();

        // Nettoyer les anciennes entrées
        const keysToDelete: string[] = [];
        loginAttempts.forEach((data, ip) => {
            if (now - data.timestamp > RESET_PERIOD) {
                keysToDelete.push(ip);
            }
        });

        keysToDelete.forEach(ip => {
            loginAttempts.delete(ip);
        });

        // Vérifier les tentatives actuelles
        const attempts = loginAttempts.get(clientIp);

        // Trop de tentatives
        if (attempts && attempts.count >= MAX_ATTEMPTS && now - attempts.timestamp < RESET_PERIOD) {
            return NextResponse.json(
                { error: 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.' },
                { status: 429 }
            );
        }

        // Tentative trop rapide
        if (attempts && now - attempts.timestamp < MIN_ATTEMPT_INTERVAL) {
            return NextResponse.json(
                { error: `Veuillez attendre ${Math.ceil((MIN_ATTEMPT_INTERVAL - (now - attempts.timestamp)) / 1000)} secondes avant de réessayer.` },
                { status: 429 }
            );
        }

        // Récupérer les données de connexion
        let email, password;
        try {
            const body = await request.json();
            email = body.email;
            password = body.password;
        } catch (e) {
            return NextResponse.json(
                { error: 'Données de requête invalides' },
                { status: 400 }
            );
        }

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email et mot de passe requis' },
                { status: 400 }
            );
        }

        // Enregistrer cette tentative
        loginAttempts.set(clientIp, {
            count: attempts ? attempts.count + 1 : 1,
            timestamp: now
        });

        // Créer un client Supabase directement
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Tentative de connexion
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return NextResponse.json(
                    { error: error.message },
                    { status: error.status || 400 }
                );
            }

            // Réinitialiser le compteur en cas de succès
            loginAttempts.delete(clientIp);

            // Retourner les jetons directement au client au lieu d'utiliser les cookies
            return NextResponse.json({
                success: true,
                session: {
                    access_token: data.session?.access_token,
                    refresh_token: data.session?.refresh_token,
                    expires_at: data.session?.expires_at
                },
                user: data.user
            });
        } catch (error: any) {
            // Gérer les erreurs spécifiques de rate limit
            if (error.status === 429 || (error.message &&
                (error.message.includes('rate limit') ||
                    error.message.includes('Request rate limit')))) {
                return NextResponse.json(
                    { error: 'Service temporairement indisponible. Veuillez patienter quelques minutes avant de réessayer.' },
                    { status: 429 }
                );
            }

            console.error('Erreur Supabase:', error);
            return NextResponse.json(
                { error: 'Erreur d\'authentification: ' + (error.message || 'Erreur inconnue') },
                { status: error.status || 500 }
            );
        }
    } catch (error: any) {
        console.error('Erreur lors de la tentative de connexion:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la tentative de connexion. Veuillez réessayer plus tard.' },
            { status: 500 }
        );
    }
}