import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WhyGNG from './components/WhyGNG';
import Company from './components/Company';
import Platforms from './components/Platforms';
import Process from './components/Process';
import Spotlight from './components/Spotlight';
import CTABand from './components/CTABand';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FitFinder from './components/FitFinder';
import AdoptionSteps from './components/AdoptionSteps';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-ink selection:bg-primary/15 selection:text-ink overflow-x-hidden">
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <WhyGNG />
        <Company />
        <Process />
        <Platforms />
        <Spotlight />
        <AdoptionSteps />
        <CTABand />
        <FitFinder />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;
