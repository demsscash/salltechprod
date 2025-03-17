'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceProps } from '@/types';
import { getServiceById } from '@/actions/serviceActions';
import { directUpdateService } from '@/actions/directUpdateService';
import { checkSupabaseConnection } from '@/lib/supabase';
import { use } from 'react';

export default function EditServicePage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
    // Déballer params avec React.use() si c'est une Promise
    const resolvedParams = params instanceof Promise ? use(params) : params;
    const serviceId = parseInt(resolvedParams.id);

    console.log("Page d'édition - ID de service:", serviceId);

    const [service, setService] = useState<ServiceProps>({
        icon: '',
        title: '',
        description: '',
        link: ''
    });

    const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean, message: string }>({
        connected: false,
        message: 'Vérification de la connexion...'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    // Test de connexion à Supabase
    useEffect(() => {
        async function testConnection() {
            try {
                const result = await checkSupabaseConnection();
                console.log('Test de connexion Supabase:', result);
                setConnectionStatus({
                    connected: result.connected,
                    message: result.connected
                        ? 'Connecté à Supabase'
                        : `Non connecté: ${result.error || 'Erreur inconnue'}`
                });
            } catch (err) {
                console.error('Erreur lors du test de connexion:', err);
                setConnectionStatus({
                    connected: false,
                    message: 'Erreur lors du test de connexion'
                });
            }
        }
        testConnection();
    }, []);

    useEffect(() => {
        async function fetchService() {
            try {
                console.log("Chargement - Début fetchService avec ID:", serviceId);

                if (isNaN(serviceId) || serviceId <= 0) {
                    console.error("Chargement - ID invalide:", serviceId);
                    throw new Error('ID de service invalide');
                }

                console.log("Chargement - Appel à getServiceById");
                const result = await getServiceById(serviceId);
                console.log("Chargement - Résultat de getServiceById:", result);

                if (!result.success || !result.data) {
                    console.error("Chargement - Service non trouvé:", result.error);
                    throw new Error(result.error || 'Service non trouvé');
                }

                console.log("Chargement - Service trouvé:", result.data);
                setService(result.data);
            } catch (err: any) {
                const errorMsg = 'Erreur lors du chargement du service: ' + (err.message || 'Erreur inconnue');
                console.error(errorMsg, err);
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, [serviceId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setService(prev => {
            const updated = { ...prev, [name]: value };
            console.log(`Modification du champ '${name}':`, updated);
            return updated;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            console.log("Sauvegarde - Début handleSubmit avec ID:", serviceId);

            if (isNaN(serviceId) || serviceId <= 0) {
                console.error("Sauvegarde - ID invalide:", serviceId);
                throw new Error('ID de service invalide');
            }

            // Utiliser l'action directe pour mettre à jour le service
            console.log("Sauvegarde - Appel à directUpdateService");
            const result = await directUpdateService(serviceId, service);
            console.log("Sauvegarde - Résultat de directUpdateService:", result);

            if (!result.success) {
                console.error("Sauvegarde - Échec:", result.error);
                throw new Error(result.error || 'Erreur lors de la sauvegarde');
            }

            // Afficher un message de succès temporaire
            setSuccessMessage('Service mis à jour avec succès!');

            // Mettre à jour les données locales avec les données mises à jour
            if (result.data) {
                setService(result.data);
            }

            // Rediriger après un court délai pour permettre à l'utilisateur de voir le message
            setTimeout(() => {
                router.push('/admin');
                router.refresh(); // Forcer un rafraîchissement complet
            }, 1500);

        } catch (err: any) {
            const errorMsg = 'Erreur lors de la sauvegarde: ' + (err.message || 'Erreur inconnue');
            console.error(errorMsg, err);
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Modifier le service (ID: {serviceId})</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-salltech-blue"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Modifier le service (ID: {serviceId})</h1>

            {/* Indicateur de statut de connexion */}
            <div className={`mb-4 p-3 rounded ${connectionStatus.connected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {connectionStatus.message}
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            <div className="bg-gray-100 p-4 mb-4 rounded overflow-auto text-xs">
                <h3 className="font-bold mb-2">Données actuelles du service:</h3>
                <pre>{JSON.stringify(service, null, 2)}</pre>
            </div>

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
                        value={service.link || ''}
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