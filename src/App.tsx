import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CurrencyConverter from './pages/CurrencyConverter';

function App() {
  return (
    <div className="bg-background min-h-screen text-slate-200 font-sans selection:bg-primary/30 selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/converter" element={<CurrencyConverter />} />
          <Route path="/forecasts" element={<div className="pt-32 text-center text-white">Forecasts Page (Coming Soon)</div>} />
          <Route path="/alerts" element={<div className="pt-32 text-center text-white">Alerts Page (Coming Soon)</div>} />
          <Route path="/profile" element={<div className="pt-32 text-center text-white">Profile Page (Coming Soon)</div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
