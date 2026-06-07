import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CurrencyConverter from './pages/CurrencyConverter';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import DigitalAssets from './pages/DigitalAssets';
import Alerts from './pages/Alerts';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="bg-background min-h-screen text-slate-200 font-sans selection:bg-primary/30 selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/converter" element={<CurrencyConverter />} />
          <Route path="/assets" element={<DigitalAssets />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forecasts" element={<div className="pt-32 text-center text-white">Forecasts Page (Coming Soon)</div>} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <Footer />
    </div>
    </AuthProvider>
  );
}

export default App;
