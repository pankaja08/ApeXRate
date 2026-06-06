import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-white">Apex<span className="text-primary">Rate</span></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Home</Link>
            <Link to="/dashboard" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Dashboard</Link>
            <Link to="/converter" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Converter</Link>
            <Link to="/forecasts" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Forecasts</Link>
            <Link to="/alerts" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Alerts</Link>
            <Link to="/profile" className="text-slate-300 hover:text-primary transition-colors text-sm font-medium">Profile</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl absolute top-full left-0 w-full border-t border-white/5">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-2xl">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-base font-medium py-2">Home</Link>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-base font-medium py-2">Dashboard</Link>
            <Link to="/converter" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-base font-medium py-2">Converter</Link>
            <Link to="/forecasts" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-base font-medium py-2">Forecasts</Link>
            <Link to="/alerts" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-base font-medium py-2">Alerts</Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-300 hover:text-white text-base font-medium py-2">Profile</Link>
            <div className="pt-4 flex flex-col gap-3">
              <button className="w-full text-slate-300 hover:text-white font-medium py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">Log In</button>
              <button className="w-full bg-primary text-background font-semibold py-2 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)]">Get Started</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
