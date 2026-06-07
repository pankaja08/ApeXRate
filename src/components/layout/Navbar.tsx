import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const base = "transition-all text-sm font-medium px-3 py-1.5 rounded-lg";
    if (location.pathname === path) {
      return `${base} bg-white/10 text-white backdrop-blur-md shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10`;
    }
    return `${base} text-slate-300 hover:text-primary hover:bg-white/5`;
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
          <Link to="/" className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
              <defs>
                <linearGradient id="leg1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="100%" stopColor="#0057FF" />
                </linearGradient>
                <linearGradient id="leg2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="100%" stopColor="#0080FF" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
                </filter>
              </defs>
              {/* Left Leg */}
              <path d="M50 10 L15 90 L35 90 L50 50 Z" fill="url(#leg1)" />
              {/* Right Leg */}
              <path d="M50 10 L50 50 L65 90 L85 90 Z" fill="url(#leg2)" />
              {/* Zigzag Arrow overlapping */}
              <g filter="url(#shadow)">
                <path d="M10 75 L35 45 L50 60 L85 20" stroke="#00F0FF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <polygon points="73,22 88,16 82,32" fill="#00F0FF" />
              </g>
            </svg>
            <span className="text-[28px] tracking-tight text-white flex items-center">
              <span className="font-extrabold">Apex</span>
              <span className="font-light">Rate</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link to="/" onClick={handleHomeClick} className={getLinkClass('/')}>Home</Link>
            <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
            <Link to="/converter" className={getLinkClass('/converter')}>Converter</Link>
            <Link to="/assets" className={getLinkClass('/assets')}>Digital Assets</Link>
            <Link to="/forecasts" className={getLinkClass('/forecasts')}>Forecasts</Link>
            <Link to="/alerts" className={getLinkClass('/alerts')}>Alerts</Link>
            <Link to="/profile" className={getLinkClass('/profile')}>Profile</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-200">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
                <button onClick={logout} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors">Log In</Link>
                <Link to="/register" className="bg-primary text-background font-semibold px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform">Get Started</Link>
              </>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white ml-2 md:hidden">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl absolute top-full left-0 w-full border-t border-white/5">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-2xl">
            <Link to="/" onClick={(e) => { setIsMobileMenuOpen(false); handleHomeClick(e); }} className={`block text-base font-medium py-2 px-4 rounded-lg ${location.pathname === '/' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Home</Link>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`block text-base font-medium py-2 px-4 rounded-lg ${location.pathname === '/dashboard' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Dashboard</Link>
            <Link to="/converter" onClick={() => setIsMobileMenuOpen(false)} className={`block text-base font-medium py-2 px-4 rounded-lg ${location.pathname === '/converter' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Converter</Link>
            <Link to="/assets" onClick={() => setIsMobileMenuOpen(false)} className={`block text-base font-medium py-2 px-4 rounded-lg ${location.pathname === '/assets' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Digital Assets</Link>
            <Link to="/forecasts" onClick={() => setIsMobileMenuOpen(false)} className={`block text-base font-medium py-2 px-4 rounded-lg ${location.pathname === '/forecasts' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Forecasts</Link>
            <Link to="/alerts" onClick={() => setIsMobileMenuOpen(false)} className={`block text-base font-medium py-2 px-4 rounded-lg ${location.pathname === '/alerts' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Alerts</Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`block text-base font-medium py-2 px-4 rounded-lg ${location.pathname === '/profile' ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>Profile</Link>
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-slate-200 py-2">
                    <UserIcon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-lg">{user.username}</span>
                  </div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-slate-300 hover:text-white font-medium py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center text-slate-300 hover:text-white font-medium py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">Log In</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center bg-primary text-background font-semibold py-2 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)]">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
