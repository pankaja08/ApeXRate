import React, { useState, useEffect } from 'react';
import Hero from '../components/sections/Hero';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import PlatformFeatures from '../components/sections/PlatformFeatures';
import HowItWorks from '../components/sections/HowItWorks';
import CtaSection from '../components/sections/CtaSection';
import LoadingOverlay from '../components/layout/LoadingOverlay';
import { useAuth } from '../context/AuthContext';

interface BankRate {
  bankName: string;
  bankLogo: string;
  buyRate: number;
  sellRate: number;
  lastUpdated: string;
}

const LandingPage = () => {
  const { user } = useAuth();
  const [banks, setBanks] = useState<BankRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/v1/rates/latest?currencyPair=USD/LKR')
      .then(res => res.json())
      .then(data => {
        setBanks(data.rates || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading && <LoadingOverlay message="Fetching real-time exchange rates..." />}
      <Hero banks={banks} />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12"></div>
      <WhyChooseUs />
      <PlatformFeatures />
      <HowItWorks />
      {!user && <CtaSection />}
    </>
  );
};

export default LandingPage;
