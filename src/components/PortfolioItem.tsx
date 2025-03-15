import Image from 'next/image'
import Link from 'next/link'
import { PortfolioItemProps } from '@/types'

export default function PortfolioItem({ title, description, image, index = 0 }: PortfolioItemProps) {
    // Délai d'animation basé sur l'index
    const transitionDelay = `${index * 0.2}s`

    return (
        <div className="portfolio-item" style={{ transitionDelay }}>
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
            />
            <div className="portfolio-overlay">
                <h3 className="text-2xl font-bold mb-2.5">{title}</h3>
                <p className="mb-5">{description}</p>
                <Link href="#" className="inline-flex items-center font-semibold text-white">
                    Voir le projet <span className="ml-2.5 transition-transform duration-300 hover:translate-x-1.5">→</span>
                </Link>
            </div>
        </div>
    )
}