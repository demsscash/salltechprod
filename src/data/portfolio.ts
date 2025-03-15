import { PortfolioItemProps } from '@/types';

export const portfolioItems: PortfolioItemProps[] = [
    {
        title: 'Plateforme E-commerce',
        description: 'Une solution complète de commerce en ligne avec des fonctionnalités avancées',
        image: '/images/placeholder.jpg'
    },
    {
        title: 'Application Mobile Banking',
        description: 'Système de gestion financière sécurisé et facile à utiliser',
        image: '/images/placeholder.jpg'
    },
    {
        title: 'Implémentation Odoo',
        description: 'Solution ERP personnalisée pour optimiser les processus d\'entreprise',
        image: '/images/placeholder.jpg'
    }
];

export const contactInfo = {
    address: '123 Avenue de la Technologie, Ville d\'Innovation',
    email: 'contact@salltech.com',
    phone: '+33 (0)1 23 45 67 89'
};

export const socialLinks = [
    { name: 'f', label: 'Facebook', url: '#' },
    { name: 't', label: 'Twitter', url: '#' },
    { name: 'in', label: 'LinkedIn', url: '#' },
    { name: 'ig', label: 'Instagram', url: '#' }
];

export const footerLinks = [
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
            { name: 'Consulting DevOps', url: '#' },
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