'use client';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';

// Contrôle des tentatives côté client
let lastLoginAttempt = 0;
const LOGIN_THROTTLE = 1000; // 1 seconde entre les tentatives

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const authCheckPerformed = useRef(false);

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        // Ne vérifier qu'une seule fois
        if (authCheckPerformed.current) return;
        authCheckPerformed.current = true;

        async function checkAuth() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    router.push('/admin');
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
            }
        }

        checkAuth();
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Vérifier si on peut faire une nouvelle tentative de connexion
        const now = Date.now();
        if (now - lastLoginAttempt < LOGIN_THROTTLE) {
            setError(`Veuillez patienter avant de réessayer`);
            return;
        }

        setLoading(true);
        setError('');
        lastLoginAttempt = now;

        try {
            // Utiliser notre route API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la connexion');
            }

            if (data.success && data.session) {
                // Définir manuellement la session Supabase
                await supabase.auth.setSession({
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token
                });

                // Rafraîchir et rediriger
                router.refresh();
                router.push('/admin');
            } else {
                setError('Échec de la connexion');
            }
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la connexion');
            console.error('Erreur de connexion:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-logo">
                    <Logo id="login" />
                </div>
                <h1 className="login-title">
                    Administration <span className="gradient-text">SALLTECH</span>
                </h1>

                {error && (
                    <div className="alert alert-error">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            required
                            placeholder="votre@email.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="cta-button"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '16px' }}
                    >
                        {loading ? (
                            <span>
                                <span className="loading-spinner" style={{ display: 'inline-block', width: '16px', height: '16px', marginRight: '8px', verticalAlign: 'middle' }}></span>
                                Connexion en cours...
                            </span>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}