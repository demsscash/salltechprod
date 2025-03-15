import './globals.css';
import { AnimationObserver } from '@/utils/animationObserver';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SALLTECH - Solutions Technologiques à Nouakchott, Mauritanie',
  description: 'SALLTECH est une entreprise leader en solutions technologiques basée à Nouakchott, Mauritanie. Développement web, applications mobiles, solutions Odoo et services DevOps personnalisés.',
  keywords: 'développement web Mauritanie, applications mobiles Nouakchott, Odoo Mauritanie, DevOps Nouakchott, hébergement web Mauritanie, SEO Nouakchott',
  openGraph: {
    title: 'SALLTECH - Solutions Technologiques en Mauritanie',
    description: 'Votre partenaire technologique de confiance en Mauritanie pour le développement web, mobile et les solutions d\'entreprise.',
    type: 'website',
    url: 'https://salltech.mr',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'SALLTECH Logo',
      },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <AnimationObserver />
        {children}
      </body>
    </html>
  );
}