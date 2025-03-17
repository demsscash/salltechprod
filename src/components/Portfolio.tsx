'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortfolioItemProps } from '@/types';
import { getPortfolioItems } from '@/actions/getPortfolioItems';

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await getPortfolioItems();
        setPortfolioItems(data);
      } catch (err) {
        console.error('Erreur lors du chargement du portfolio:', err);
        setError("Impossible de charger les projets. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();

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

  if (loading) {
    return (
      <section className="portfolio" id="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Notre <span className="gradient-text">Portfolio</span></h2>
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
      <section className="portfolio" id="portfolio">
        <div className="container">
          <div className="section-title">
            <h2>Notre <span className="gradient-text">Portfolio</span></h2>
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
    <section className="portfolio" id="portfolio">
      <div className="container">
        <div className="section-title">
          <h2>Notre <span className="gradient-text">Portfolio</span></h2>
          <p>Découvrez nos projets réussis et comment nous avons aidé les entreprises mauritaniennes à se digitaliser</p>
        </div>
        <div className="portfolio-grid">
          {portfolioItems.map((item, index) => (
            <div key={item.id} className="portfolio-item" style={{ transitionDelay: `${index * 0.2}s` }}>
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
                <Link href={item.link || '#'} className="portfolio-link">Voir le projet <span>→</span></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}