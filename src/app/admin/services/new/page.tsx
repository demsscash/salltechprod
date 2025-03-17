'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceProps } from '@/types';
import { createService } from '@/actions/serviceActions';

export default function CreateServicePage() {
    const [service, setService] = useState<Omit<ServiceProps, 'id'>>({
        icon: '',
        title: '',
        description: '',
        link: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

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
            // Validation basique
            if (!service.title || !service.description || !service.icon) {
                throw new Error('Tous les champs obligatoires doivent être remplis');
            }

            const result = await createService(service);

            if (!result.success) {
                throw new Error(result.error || 'Erreur lors de la création du service');
            }

            setSuccessMessage('Service créé avec succès!');

            // Rediriger après un court délai
            setTimeout(() => {
                router.push('/admin');
                router.refresh();
            }, 1500);
        } catch (err: any) {
            setError('Erreur: ' + err.message);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <h1 className="admin-title" style={{ marginBottom: '24px' }}>Créer un nouveau service</h1>

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
                        Icône *
                    </label>
                    <input
                        type="text"
                        id="icon"
                        name="icon"
                        value={service.icon}
                        onChange={handleChange}
                        className="form-input"
                        required
                        placeholder="Exemple: ⚡"
                    />
                    <p className="form-hint">Utilisez un emoji ou un caractère symbolique</p>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="title">
                        Titre *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={service.title}
                        onChange={handleChange}
                        className="form-input"
                        required
                        placeholder="Exemple: Sites Internet"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="description">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={service.description}
                        onChange={handleChange}
                        className="form-textarea"
                        rows={4}
                        required
                        placeholder="Décrivez le service en quelques phrases..."
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
                        value={service.link}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://exemple.com"
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
                        {saving ? 'Création...' : 'Créer le service'}
                    </button>
                </div>
            </form>
        </>
    );
}