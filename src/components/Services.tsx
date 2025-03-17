'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ServiceProps } from '@/types';
import { getServices } from '@/actions/getServices';

export default function Services() {
  const [services, setServices] = useState<ServiceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError("Impossible de charger les services. Veuillez réessayer.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();

    // Code d'animation existant...
    function isElementInViewport(el: Element) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
      );
    }

    function handleScroll() {
      const elements = document.querySelectorAll('.service-card, .section-title');

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

  if (loading) {
    return (
      <section className="services" id="services">
        <div className="container">
          <div className="section-title">
            <h2>Nos <span className="gradient-text">Services</span></h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-salltech-blue"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="services" id="services">
        <div className="container">
          <div className="section-title">
            <h2>Nos <span className="gradient-text">Services</span></h2>
          </div>
          <div className="flex justify-center items-center h-64 flex-col">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-salltech-blue text-white py-2 px-4 rounded-full hover:bg-opacity-80 transition-all"
            >
              Réessayer
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-title">
          <h2>Nos <span className="gradient-text">Services</span></h2>
          <p>Startup technologique en Mauritanie, nous proposons des solutions innovantes adaptées aux spécificités du marché local</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.id} className="service-card" style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className={`service-icon bg-salltech-${index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'red'}/10 text-salltech-${index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'red'}`}>
                <span>{service.icon}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link href={service.link ?? '#'} className="service-link">
                En savoir plus <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
