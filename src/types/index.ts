export interface ServiceProps {
    id?: number;
    icon: string;
    title: string;
    description: string;
    link?: string;
    index?: number;
}

export interface PortfolioItemProps {
    id?: number;
    title: string;
    description: string;
    image: string;
    link?: string;
    index?: number;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export interface SocialLink {
    id?: number;
    name: string;
    label: string;
    url: string;
}

export interface FooterLink {
    name: string;
    url: string;
}

export interface FooterLinkGroup {
    title: string;
    links: FooterLink[];
}

export interface ContactInfo {
    id?: number;
    address: string;
    email: string;
    phone: string;
}