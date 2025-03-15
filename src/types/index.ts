export interface ServiceProps {
    icon: string;
    title: string;
    description: string;
    index?: number;
}

export interface PortfolioItemProps {
    title: string;
    description: string;
    image: string;
    index?: number;
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export interface SocialLink {
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
    address: string;
    email: string;
    phone: string;
}