'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceProps, PortfolioItemProps, ContactInfo } from '@/types';
import { getServices } from '@/actions/getServices';
import { getPortfolioItems } from '@/actions/getPortfolioItems';
import { getContactInfo } from '@/actions/getContactInfo';
import { deleteService } from '@/actions/serviceActions';
import { deletePortfolioItem } from '@/actions/portfolioActions';

export default function AdminPage() {
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
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Panel d'administration</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-salltech-blue"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Panel d'administration</h1>
                <div className="flex justify-center items-center h-64 flex-col">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-salltech-blue text-white py-2 px-4 rounded hover:bg-opacity-80 transition-all"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Panel d'administration</h1>

            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'services' ? 'border-b-2 border-salltech-blue font-bold' : ''}`}
                    onClick={() => setActiveTab('services')}
                >
                    Services
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'portfolio' ? 'border-b-2 border-salltech-blue font-bold' : ''}`}
                    onClick={() => setActiveTab('portfolio')}
                >
                    Portfolio
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'contact' ? 'border-b-2 border-salltech-blue font-bold' : ''}`}
                    onClick={() => setActiveTab('contact')}
                >
                    Contact
                </button>
            </div>

            {activeTab === 'services' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Services</h2>
                        <button
                            onClick={() => router.push('/admin/services/new')}
                            className="bg-salltech-blue text-white py-2 px-4 rounded hover:bg-opacity-80 transition-all"
                        >
                            Ajouter un service
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">Icône</th>
                                    <th className="py-2 px-4 border">Titre</th>
                                    <th className="py-2 px-4 border">Description</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(service => (
                                    <tr key={service.id}>
                                        <td className="py-2 px-4 border">{service.id}</td>
                                        <td className="py-2 px-4 border">{service.icon}</td>
                                        <td className="py-2 px-4 border">{service.title}</td>
                                        <td className="py-2 px-4 border">{service.description.substring(0, 50)}...</td>
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => router.push(`/admin/services/edit/${service.id}`)}
                                                className="bg-salltech-blue text-white py-1 px-3 rounded mr-2 hover:bg-opacity-80 transition-all"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteService(service.id)}
                                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-opacity-80 transition-all"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'portfolio' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Projets Portfolio</h2>
                        <button
                            onClick={() => router.push('/admin/portfolio/new')}
                            className="bg-salltech-blue text-white py-2 px-4 rounded hover:bg-opacity-80 transition-all"
                        >
                            Ajouter un projet
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">Image</th>
                                    <th className="py-2 px-4 border">Titre</th>
                                    <th className="py-2 px-4 border">Description</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolioItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="py-2 px-4 border">{item.id}</td>
                                        <td className="py-2 px-4 border">
                                            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
                                        </td>
                                        <td className="py-2 px-4 border">{item.title}</td>
                                        <td className="py-2 px-4 border">{item.description.substring(0, 50)}...</td>
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => router.push(`/admin/portfolio/edit/${item.id}`)}
                                                className="bg-salltech-blue text-white py-1 px-3 rounded mr-2 hover:bg-opacity-80 transition-all"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeletePortfolioItem(item.id)}
                                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-opacity-80 transition-all"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'contact' && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Informations de Contact</h2>
                    {contactInfo ? (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="mb-4">
                                <h3 className="font-bold">Adresse:</h3>
                                <p>{contactInfo.address}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-bold">Email:</h3>
                                <p>{contactInfo.email}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-bold">Téléphone:</h3>
                                <p>{contactInfo.phone}</p>
                            </div>
                            <button
                                onClick={() => router.push('/admin/contact/edit')}
                                className="bg-salltech-blue text-white py-2 px-4 rounded hover:bg-opacity-80 transition-all"
                            >
                                Modifier
                            </button>
                        </div>
                    ) : (
                        <p>Aucune information de contact trouvée.</p>
                    )}
                </div>
            )}
        </div>
    );
}