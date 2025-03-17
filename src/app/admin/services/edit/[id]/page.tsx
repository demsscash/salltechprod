'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceProps } from '@/types';
import { getServiceById, updateService } from '@/actions/serviceActions';

// Correction de l'interface des paramètres
interface PageProps {
    params: {
        id: string;
    }
}

export default function EditServicePage({ params }: PageProps) {
    const serviceId = parseInt(params.id);
    const [service, setService] = useState<ServiceProps>({
        icon: '',
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchService() {
            try {
                if (isNaN(serviceId)) {
                    throw new Error('ID de service invalide');
                }

                const result = await getServiceById(serviceId);
                if (!result.success || !result.data) {
                    throw new Error(result.error || 'Service non trouvé');
                }

                setService(result.data);
            } catch (err: any) {
                setError('Erreur lors du chargement du service: ' + err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, [serviceId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setService(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            if (isNaN(serviceId)) {
                throw new Error('ID de service invalide');
            }

            // Créer un objet avec seulement les champs à mettre à jour
            const updates: Partial<ServiceProps> = {
                icon: service.icon,
                title: service.title,
                description: service.description,
                link: service.link
            };

            const result = await updateService(serviceId, updates);

            if (!result.success) {
                throw new Error(result.error || 'Erreur lors de la mise à jour');
            }

            setSuccessMessage('Service mis à jour avec succès!');

            // Rediriger après un court délai
            setTimeout(() => {
                router.push('/admin');
                router.refresh();
            }, 1500);

        } catch (err: any) {
            setError('Erreur lors de la mise à jour: ' + err.message);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <>
            <h1 className="admin-title" style={{ marginBottom: '24px' }}>Modifier le service</h1>

            {error && (
                <div className="alert alert-error">
                    <p>{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="alert alert-success">
                    <p>{successMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label className="form-label" htmlFor="icon">
                        Icône
                    </label>
                    <input
                        type="text"
                        id="icon"
                        name="icon"
                        value={service.icon}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                    <p className="form-hint">Utilisez un emoji ou un caractère symbolique</p>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="title">
                        Titre
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={service.title}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={service.description}
                        onChange={handleChange}
                        className="form-textarea"
                        rows={4}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="link">
                        Lien (optionnel)
                    </label>
                    <input
                        type="text"
                        id="link"
                        name="link"
                        value={service.link || ''}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="form-button-cancel"
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        className="form-button-submit"
                        disabled={saving}
                    >
                        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                </div>
            </form>
        </>
    );
}