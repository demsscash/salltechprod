'use client';
import { useEffect } from 'react';
import Link from 'next/link';

interface ServiceItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  link: string;
}

// Données des services
const services: ServiceItem[] = [
  {
    id: 1,
    icon: '⚡',
    title: 'Sites Internet',
    description: 'Création de sites web performants et adaptés aux réalités mauritaniennes, optimisés pour les connexions locales et le multilinguisme.',
    link: '#'
  },
  {
    id: 2,
    icon: '📱',
    title: 'Applications Mobiles',
    description: 'Applications natives et cross-platform pour iOS et Android, adaptées au marché mauritanien et aux usages spécifiques en Afrique de l\'Ouest.',
    link: '#'
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Solutions Odoo',
    description: 'Implémentation et personnalisation d\'Odoo ERP pour les entreprises mauritaniennes, avec adaptation aux normes fiscales et commerciales locales.',
    link: '#'
  },
  {
    id: 4,
    icon: '🚀',
    title: 'Consulting DevOps & Cloud',
    description: 'Services DevOps et solutions Cloud adaptés aux infrastructures mauritaniennes, avec déploiements optimisés et migration vers AWS, Azure ou GCP.',
    link: '#'
  },
  {
    id: 5,
    icon: '🌐',
    title: 'Hébergement Web',
    description: 'Services d\'hébergement optimisés pour le marché mauritanien avec data centers au Maroc et en Europe, garantissant rapidité et stabilité.',
    link: '#'
  },
  {
    id: 6,
    icon: '📈',
    title: 'SEO & Référencement',
    description: 'Stratégies SEO spécifiques pour la Mauritanie et l\'Afrique de l\'Ouest, optimisation pour les recherches en français et en arabe.',
    link: '#'
  }
];

export default function Services() {
  useEffect(() => {
    // Fonction pour vérifier si un élément est visible dans la fenêtre
    function isElementInViewport(el: Element) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
      );
    }
    
    // Ajoute la classe 'animate' aux éléments visibles
    function handleScroll() {
      const elements = document.querySelectorAll('.service-card, .section-title');
      
      elements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('animate')) {
          element.classList.add('animate');
        }
      });
    }
    
    // Appel initial et à chaque défilement
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-title">
          <h2>Nos <span className="gradient-text">Services</span></h2>
          <p>Startup technologique en Mauritanie, nous proposons des solutions innovantes adaptées aux spécificités du marché local</p>
        </div>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <span>{service.icon}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link href={service.link} className="service-link">En savoir plus <span>→</span></Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}