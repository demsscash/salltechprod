import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

// Composants de chargement pour améliorer l'UX
function ServicesLoading() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-title">
          <h2>Nos <span className="gradient-text">Services</span></h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-salltech-blue"></div>
        </div>
      </div>
    </section>
  );
}

function PortfolioLoading() {
  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <div className="section-title">
          <h2>Notre <span className="gradient-text">Portfolio</span></h2>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-salltech-blue"></div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<ServicesLoading />}>
          <Services />
        </Suspense>
        <Suspense fallback={<PortfolioLoading />}>
          <Portfolio />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </>
  );
}