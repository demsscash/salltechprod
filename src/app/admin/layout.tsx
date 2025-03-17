'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { supabase, getSessionWithCache } from '@/lib/supabase';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Vérifier l'authentification au chargement
    useEffect(() => {
        let isActive = true;

        async function checkAuth() {
            try {
                setLoading(true);
                const { data: { session } } = await getSessionWithCache();

                if (!isActive) return;

                if (!session) {
                    router.push('/login');
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
                if (isActive) router.push('/login');
            } finally {
                if (isActive) setLoading(false);
            }
        }

        checkAuth();

        return () => {
            isActive = false;
        };
    }, [router]);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // La redirection est déjà gérée dans useEffect
    }

    return (
        <div className="admin-layout">
            {/* Header */}
            <header className="admin-header">
                <div className="container admin-header-content">
                    <div className="admin-logo">
                        <Link href="/admin">
                            <Logo id="admin-header" />

                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="admin-nav">
                        <Link
                            href="/admin"
                            className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/services"
                            className={`admin-nav-link ${pathname.includes('/admin/services') ? 'active' : ''}`}
                        >
                            Services
                        </Link>
                        <Link
                            href="/admin/portfolio"
                            className={`admin-nav-link ${pathname.includes('/admin/portfolio') ? 'active' : ''}`}
                        >
                            Portfolio
                        </Link>
                        <Link
                            href="/admin/contact"
                            className={`admin-nav-link ${pathname.includes('/admin/contact') ? 'active' : ''}`}
                        >
                            Contact
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="admin-logout-button"
                        >
                            Déconnexion
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="admin-menu-button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="admin-nav-mobile">
                        <Link
                            href="/admin"
                            className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/services"
                            className={`admin-nav-link ${pathname.includes('/admin/services') ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Services
                        </Link>
                        <Link
                            href="/admin/portfolio"
                            className={`admin-nav-link ${pathname.includes('/admin/portfolio') ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Portfolio
                        </Link>
                        <Link
                            href="/admin/contact"
                            className={`admin-nav-link ${pathname.includes('/admin/contact') ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="admin-logout-button"
                        >
                            Déconnexion
                        </button>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="admin-main container">
                {children}
            </main>

            {/* Footer */}
            <footer className="admin-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} SALLTECH Administration. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}