'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  useEffect(() => {
    // Animation du texte du héros
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    const heroButton = document.querySelector('.hero .cta-button');
    
    if (heroTitle && heroText && heroButton) {
      setTimeout(() => {
        heroTitle.classList.add('animate');
        
        setTimeout(() => {
          heroText.classList.add('animate');
          
          setTimeout(() => {
            heroButton.classList.add('animate');
          }, 300);
        }, 300);
      }, 300);
    }
  }, []);

  return (
    <section className="hero" id="home">
      <div className="container hero-content">
        <h1>Innover. Créer. <span className="gradient-text">Transformer.</span></h1>
        <p>Startup innovante à Nouakchott, nous développons des solutions digitales sur mesure pour accompagner les entreprises mauritaniennes dans leur transformation numérique.</p>
        <Link href="#services" className="cta-button">Découvrir nos services</Link>
      </div>
      <div className="hero-image">
        <Image 
          src="/images/hero.jpg" 
          alt="Image d'accueil"
          width={600}
          height={800}
          priority
        />
      </div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </section>
  );
}