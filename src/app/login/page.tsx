'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/admin');
            }
        }

        checkAuth();
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw new Error(error.message);
            }

            if (data?.session) {
                router.push('/admin');
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