import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
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
              <a href="#" aria-label="Facebook"><span>f</span></a>
              <a href="#" aria-label="Twitter"><span>t</span></a>
              <a href="#" aria-label="LinkedIn"><span>in</span></a>
              <a href="#" aria-label="Instagram"><span>ig</span></a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Entreprise</h3>
            <ul>
              <li><Link href="#">À propos</Link></li>
              <li><Link href="#">Notre équipe</Link></li>
              <li><Link href="#">Carrières</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Services</h3>
            <ul>
              <li><Link href="#">Sites Internet</Link></li>
              <li><Link href="#">Applications Mobiles</Link></li>
              <li><Link href="#">Solutions Odoo</Link></li>
              <li><Link href="#">DevOps & Cloud</Link></li>
              <li><Link href="#">Hébergement Web</Link></li>
              <li><Link href="#">SEO & Référencement</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h3>Ressources</h3>
            <ul>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Études de cas</Link></li>
              <li><Link href="#">Documentation</Link></li>
              <li><Link href="#">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} SALLTECH Mauritanie. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}