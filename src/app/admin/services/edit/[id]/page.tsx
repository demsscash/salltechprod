'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceProps } from '@/types';

export default function EditServicePage({ params }: { params: { id: string } }) {
    const [service, setService] = useState<ServiceProps>({
        icon: '',
        title: '',
        description: '',
        link: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchService() {
            try {
                const response = await fetch(`/api/services/${params.id}`);

                if (!response.ok) {
                    throw new Error('Service non trouvé');
                }

                const data = await response.json();
                setService(data);
            } catch (err) {
                setError('Erreur lors du chargement du service');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setService(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`/api/services/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(service)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde');
            }

            router.push('/admin');
        } catch (err) {
            setError('Erreur lors de la sauvegarde du service');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-salltech-blue"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Modifier le service</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="icon">
                        Icône
                    </label>
                    <input
                        type="text"
                        id="icon"
                        name="icon"
                        value={service.icon}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="title">
                        Titre
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={service.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={service.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        rows={4}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="link">
                        Lien
                    </label>
                    <input
                        type="text"
                        id="link"
                        name="link"
                        value={service.link}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        className="bg-salltech-blue text-white py-2 px-4 rounded"
                        disabled={saving}
                    >
                        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                </div>
            </form>
        </div>
    );
}