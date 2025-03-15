'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PortfolioItem {
  id: number;
  image: string;
  title: string;
  description: string;
  link: string;
}

// Données du portfolio
const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    image: '/images/portfolio-1.jpg',
    title: 'Plateforme E-commerce',
    description: 'Solution de commerce en ligne pour Nouakchott Shop, avec paiement mobile et livraison locale',
    link: '#'
  },
  {
    id: 2,
    image: '/images/portfolio-2.jpg',
    title: 'Application Mobile Banking',
    description: 'Application sécurisée développée pour une grande banque mauritanienne, avec 50 000+ utilisateurs actifs',
    link: '#'
  },
  {
    id: 3,
    image: '/images/portfolio-3.jpg',
    title: 'Implémentation Odoo',
    description: 'Déploiement complet d\'Odoo pour une entreprise d\'import-export à Nouakchott avec modules personnalisés',
    link: '#'
  }
];

export default function Portfolio() {
  useEffect(() => {
    // Animation des éléments au scroll
    function isElementInViewport(el: Element) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
      );
    }
    
    function handleScroll() {
      const elements = document.querySelectorAll('.portfolio-item, .section-title');
      
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

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <div className="section-title">
          <h2>Notre <span className="gradient-text">Portfolio</span></h2>
          <p>Découvrez nos projets réussis et comment nous avons aidé les entreprises mauritaniennes à se digitaliser</p>
        </div>
        <div className="portfolio-grid">
          {portfolioItems.map(item => (
            <div key={item.id} className="portfolio-item">
              <Image 
                src={item.image} 
                alt={item.title}
                className="portfolio-image"
                width={600}
                height={600}
              />
              <div className="portfolio-overlay">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.link} className="portfolio-link">Voir le projet <span>→</span></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}