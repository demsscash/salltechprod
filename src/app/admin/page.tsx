'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceProps, PortfolioItemProps, ContactInfo } from '@/types';
import { getServices } from '@/actions/getServices';
import { getPortfolioItems } from '@/actions/getPortfolioItems';
import { getContactInfo } from '@/actions/getContactInfo';
import { deleteService } from '@/actions/serviceActions';
import { deletePortfolioItem } from '@/actions/portfolioActions';

export default function AdminDashboard() {
    const [services, setServices] = useState<ServiceProps[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItemProps[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [activeTab, setActiveTab] = useState('services');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // Chargement parallèle des données
                const [servicesData, portfolioData, contactData] = await Promise.all([
                    getServices(),
                    getPortfolioItems(),
                    getContactInfo()
                ]);

                setServices(servicesData);
                setPortfolioItems(portfolioData);
                setContactInfo(contactData);
            } catch (err) {
                console.error('Erreur lors du chargement des données:', err);
                setError('Impossible de charger les données. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleDeleteService = async (id?: number) => {
        if (!id) return;

        if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
            const result = await deleteService(id);

            if (result.success) {
                // Mise à jour locale de l'état
                setServices(services.filter(service => service.id !== id));
            } else {
                alert(`Erreur: ${result.error}`);
            }
        }
    };

    const handleDeletePortfolioItem = async (id?: number) => {
        if (!id) return;

        if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            const result = await deletePortfolioItem(id);

            if (result.success) {
                // Mise à jour locale de l'état
                setPortfolioItems(portfolioItems.filter(item => item.id !== id));
            } else {
                alert(`Erreur: ${result.error}`);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="form-button-submit"
                    style={{ marginTop: '16px' }}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="admin-page-title">
                <h1 className="admin-title">Tableau de bord d'administration</h1>
                <p className="admin-subtitle">Gérez le contenu de votre site web</p>
            </div>

            <div className="admin-cards">
                <div className="admin-card admin-card-blue">
                    <h3 className="admin-card-title">Services</h3>
                    <p className="admin-card-content">Nombre total: {services.length}</p>
                    <button
                        onClick={() => router.push('/admin/services/new')}
                        className="cta-button"
                    >
                        Ajouter un service
                    </button>
                </div>

                <div className="admin-card admin-card-purple">
                    <h3 className="admin-card-title">Portfolio</h3>
                    <p className="admin-card-content">Nombre total: {portfolioItems.length}</p>
                    <button
                        onClick={() => router.push('/admin/portfolio/new')}
                        className="cta-button"
                    >
                        Ajouter un projet
                    </button>
                </div>

                <div className="admin-card admin-card-red">
                    <h3 className="admin-card-title">Contact</h3>
                    <p className="admin-card-content">Informations de contact: {contactInfo ? 'Configurées' : 'Non configurées'}</p>
                    <button
                        onClick={() => router.push('/admin/contact/edit')}
                        className="cta-button"
                    >
                        Modifier les infos
                    </button>
                </div>
            </div>

            <div className="admin-tabs">
                <div className="admin-tab-buttons">
                    <button
                        className={`admin-tab-button ${activeTab === 'services' ? 'active' : ''}`}
                        onClick={() => setActiveTab('services')}
                    >
                        Services
                    </button>
                    <button
                        className={`admin-tab-button ${activeTab === 'portfolio' ? 'active' : ''}`}
                        onClick={() => setActiveTab('portfolio')}
                    >
                        Portfolio
                    </button>
                    <button
                        className={`admin-tab-button ${activeTab === 'contact' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contact')}
                    >
                        Contact
                    </button>
                </div>

                {activeTab === 'services' && (
                    <div className="admin-tab-content">
                        <div className="admin-section-header">
                            <h2 className="admin-section-title">Services</h2>
                            <button
                                onClick={() => router.push('/admin/services/new')}
                                className="admin-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Ajouter un service
                            </button>
                        </div>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Icône</th>
                                        <th>Titre</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.length > 0 ? (
                                        services.map(service => (
                                            <tr key={service.id}>
                                                <td>{service.id}</td>
                                                <td style={{ fontSize: '24px' }}>{service.icon}</td>
                                                <td>{service.title}</td>
                                                <td>{service.description.substring(0, 70)}...</td>
                                                <td>
                                                    <div className="admin-action-buttons">
                                                        <button
                                                            onClick={() => router.push(`/admin/services/edit/${service.id}`)}
                                                            className="admin-edit-button"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteService(service.id)}
                                                            className="admin-delete-button"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                                                Aucun service trouvé
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'portfolio' && (
                    <div className="admin-tab-content">
                        <div className="admin-section-header">
                            <h2 className="admin-section-title">Projets Portfolio</h2>
                            <button
                                onClick={() => router.push('/admin/portfolio/new')}
                                className="admin-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Ajouter un projet
                            </button>
                        </div>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Titre</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolioItems.length > 0 ? (
                                        portfolioItems.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>
                                                    <div className="admin-table-image">
                                                        <img src={item.image} alt={item.title} />
                                                    </div>
                                                </td>
                                                <td>{item.title}</td>
                                                <td>{item.description.substring(0, 70)}...</td>
                                                <td>
                                                    <div className="admin-action-buttons">
                                                        <button
                                                            onClick={() => router.push(`/admin/portfolio/edit/${item.id}`)}
                                                            className="admin-edit-button"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePortfolioItem(item.id)}
                                                            className="admin-delete-button"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                                                Aucun projet trouvé
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="admin-tab-content">
                        <h2 className="admin-section-title">Informations de Contact</h2>
                        {contactInfo ? (
                            <div className="admin-info-card">
                                <div className="admin-info-grid">
                                    <div className="admin-info-item">
                                        <h3 className="admin-info-label">Adresse</h3>
                                        <p className="admin-info-value">{contactInfo.address}</p>
                                    </div>
                                    <div className="admin-info-item">
                                        <h3 className="admin-info-label">Email</h3>
                                        <p className="admin-info-value">{contactInfo.email}</p>
                                    </div>
                                    <div className="admin-info-item">
                                        <h3 className="admin-info-label">Téléphone</h3>
                                        <p className="admin-info-value">{contactInfo.phone}</p>
                                    </div>
                                </div>
                                <div style={{ marginTop: '24px' }}>
                                    <button
                                        onClick={() => router.push('/admin/contact/edit')}
                                        className="admin-button"
                                    >
                                        Modifier les informations
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-warning">
                                <p>Aucune information de contact configurée.</p>
                                <button
                                    onClick={() => router.push('/admin/contact/edit')}
                                    className="form-button-submit"
                                    style={{ marginTop: '16px' }}
                                >
                                    Configurer les informations de contact
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}