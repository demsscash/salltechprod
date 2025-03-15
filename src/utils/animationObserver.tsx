'use client';
import { useEffect } from 'react';

export function useAnimationObserver() {
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
      const elements = document.querySelectorAll('.service-card, .portfolio-item, .section-title, .contact-form, .contact-info');
      
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
}

export function AnimationObserver() {
  useAnimationObserver();
  return null;
}