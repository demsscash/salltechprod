'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ServiceProps, PortfolioItemProps, ContactInfo } from '@/types';

export default function AdminPage() {
    const [services, setServices] = useState<ServiceProps[]>([]);
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItemProps[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        async function fetchData() {
            // Charger les services
            const { data: servicesData } = await supabase
                .from('services')
                .select('*')
                .order('id');

            if (servicesData) setServices(servicesData);

            // Charger les projets
            const { data: portfolioData } = await supabase
                .from('portfolio_items')
                .select('*')
                .order('id');

            if (portfolioData) setPortfolioItems(portfolioData);

            // Charger les informations de contact
            const { data: contactData } = await supabase
                .from('contact_info')
                .select('*')
                .single();

            if (contactData) setContactInfo(contactData);
        }

        fetchData();
    }, []);

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
                    <h2 className="text-2xl font-bold mb-4">Services</h2>
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
                                            <button className="bg-salltech-blue text-white py-1 px-3 rounded mr-2">Modifier</button>
                                            <button className="bg-red-500 text-white py-1 px-3 rounded">Supprimer</button>
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
                    <h2 className="text-2xl font-bold mb-4">Projets Portfolio</h2>
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
                                            <button className="bg-salltech-blue text-white py-1 px-3 rounded mr-2">Modifier</button>
                                            <button className="bg-red-500 text-white py-1 px-3 rounded">Supprimer</button>
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
                            <button className="bg-salltech-blue text-white py-2 px-4 rounded">Modifier</button>
                        </div>
                    ) : (
                        <p>Chargement des informations...</p>
                    )}
                </div>
            )}
        </div>
    );
}