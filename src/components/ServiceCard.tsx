import Link from 'next/link'
import { ServiceProps } from '@/types'
import { serviceIconColors } from '@/data/services'

export default function ServiceCard({ icon, title, description, index = 0 }: ServiceProps) {
    // Récupérer les classes de couleur pour l'icône en fonction de l'index
    const iconColorClass = serviceIconColors[index % serviceIconColors.length]

    // Délai d'animation basé sur l'index
    const transitionDelay = `${index * 0.1}s`

    return (
        <div className="service-card" style={{ transitionDelay }}>
            <div className={`service-icon ${iconColorClass}`}>
                <span>{icon}</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-gray-600 mb-5">{description}</p>
            <Link
                href="#"
                className="inline-flex items-center font-semibold text-salltech-dark hover:text-salltech-blue transition-all duration-300"
            >
                En savoir plus
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
        </div>
    )
}