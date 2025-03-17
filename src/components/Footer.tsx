'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { SocialLink, FooterLinkGroup } from '@/types';
import { getSocialLinks } from '@/actions/getSocialLinks';

// Données statiques pour les groupes de liens du footer
const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: 'Entreprise',
    links: [
      { name: 'À propos', url: '#' },
      { name: 'Notre équipe', url: '#' },
      { name: 'Carrières', url: '#' },
      { name: 'Contact', url: '#' }
    ]
  },
  {
    title: 'Services',
    links: [
      { name: 'Sites Internet', url: '#' },
      { name: 'Applications Mobiles', url: '#' },
      { name: 'Solutions Odoo', url: '#' },
      { name: 'DevOps & Cloud', url: '#' },
      { name: 'Hébergement Web', url: '#' },
      { name: 'SEO & Référencement', url: '#' }
    ]
  },
  {
    title: 'Ressources',
    links: [
      { name: 'Blog', url: '#' },
      { name: 'Études de cas', url: '#' },
      { name: 'Documentation', url: '#' },
      { name: 'FAQ', url: '#' }
    ]
  }
];

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSocialLinks() {
      try {
        const links = await getSocialLinks();
        setSocialLinks(links);
      } catch (err) {
        console.error('Erreur lors du chargement des liens sociaux:', err);
        setError("Impossible de charger les liens sociaux.");
      } finally {
        setLoading(false);
      }
    }

    loadSocialLinks();
  }, []);

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo">
              <Logo id="footer" />
            </div>
            <p>Développer des solutions digitales innovantes pour répondre aux besoins spécifiques du marché mauritanien.</p>
            <div className="social-links">
              {loading ? (
                <div className="animate-pulse flex space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  ))}
                </div>
              ) : socialLinks.map(link => (
                <a key={link.id} href={link.url} aria-label={link.label}>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {footerLinkGroups.map((group, index) => (
            <div key={index} className="footer-links">
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.url}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} SALLTECH Mauritanie. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}