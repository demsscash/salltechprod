'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  useEffect(() => {
    // Header fixe au défilement
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 50) {
          header.style.padding = '15px 0';
          header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
          header.style.padding = '30px 0';
          header.style.boxShadow = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <div className="container header-content">
        <div className="logo">
          <Logo id="header" />
        </div>
        <nav>
          <ul>
            <li><Link href="#home">Accueil</Link></li>
            <li><Link href="#services">Services</Link></li>
            <li><Link href="#portfolio">Portfolio</Link></li>
          </ul>
        </nav>
        <Link href="#contact" className="cta-button">Contactez-nous</Link>
      </div>
    </header>
  );
}