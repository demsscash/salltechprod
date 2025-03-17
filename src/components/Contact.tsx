'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { ContactInfo } from '@/types';
import { getContactInfo } from '@/actions/getContactInfo';
import { supabase } from '@/lib/supabase';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface SubmitResult {
  success: boolean;
  message: string;
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult>({ success: false, message: '' });

  useEffect(() => {
    async function loadContactInfo() {
      const info = await getContactInfo();
      setContactInfo(info);
    }

    loadContactInfo();

    // Animation des éléments au scroll
    function isElementInViewport(el: Element) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
      );
    }

    function handleScroll() {
      const elements = document.querySelectorAll('.contact-form, .contact-info');

      elements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('animate')) {
          element.classList.add('animate');
        }
      });
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enregistrer le message de contact dans Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message
          }
        ]);

      if (error) throw error;

      setSubmitResult({
        success: true,
        message: 'Votre message a été envoyé avec succès! Nous vous répondrons bientôt.'
      });

      // Réinitialiser le formulaire
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Erreur d\'envoi:', error);
      setSubmitResult({
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-wrap">
          <div className="contact-info">
            <h2>Contactez-<span className="gradient-text">nous</span></h2>
            <p>Discutons de la façon dont nous pouvons digitaliser votre entreprise en Mauritanie avec nos solutions adaptées au marché local</p>
            <div className="contact-item">
              <div className="contact-icon">
                <span>📍</span>
              </div>
              <div>
                <h4>Adresse</h4>
                <p>{contactInfo?.address || 'Chargement...'}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <span>📧</span>
              </div>
              <div>
                <h4>Email</h4>
                <p>{contactInfo?.email || 'Chargement...'}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <span>📞</span>
              </div>
              <div>
                <h4>Téléphone</h4>
                <p>{contactInfo?.phone || 'Chargement...'}</p>
              </div>
            </div>
          </div>
          <div className="contact-form">
            {submitResult.message && (
              <div className={`form-message ${submitResult.success ? 'success' : 'error'}`} style={{
                padding: '15px',
                marginBottom: '20px',
                borderRadius: '10px',
                backgroundColor: submitResult.success ? 'rgba(52, 152, 219, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                color: submitResult.success ? 'var(--blue)' : 'var(--red)'
              }}>
                {submitResult.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Votre Nom</label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Adresse Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="jean@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">Votre Message</label>
                <textarea
                  id="message"
                  className="form-textarea"
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="cta-button"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}