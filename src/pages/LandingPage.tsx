import React from 'react';
import Hero from '../components/sections/Hero';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import PlatformFeatures from '../components/sections/PlatformFeatures';
import HowItWorks from '../components/sections/HowItWorks';
import CtaSection from '../components/sections/CtaSection';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12"></div>
      <WhyChooseUs />
      <PlatformFeatures />
      <HowItWorks />
      <CtaSection />
    </>
  );
};

export default LandingPage;
