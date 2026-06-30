import React from 'react';
import { ArrowRight, Play, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BankRate {
  bankName: string;
  bankLogo: string;
  buyRate: number;
  sellRate: number;
  lastUpdated: string;
}

interface HeroProps {
  banks: BankRate[];
}

const Hero: React.FC<HeroProps> = ({ banks }) => {

  const localBanks = banks.filter(b => b.bankName !== 'Global API');
  const bestBuy = localBanks.length > 0 ? localBanks.reduce((max, bank) => bank.buyRate > max.buyRate ? bank : max) : null;
  const bestSell = localBanks.length > 0 ? localBanks.reduce((min, bank) => bank.sellRate < min.sellRate ? bank : min) : null;
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Dollars Animation Wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <DollarSign className="absolute left-[10%] text-primary/20 w-16 h-16 animate-float-1" />
        <DollarSign className="absolute left-[30%] text-accent/10 w-24 h-24 animate-float-2" />
        <DollarSign className="absolute left-[50%] text-primary/10 w-12 h-12 animate-float-3" />
        <DollarSign className="absolute left-[70%] text-accent/20 w-20 h-20 animate-float-4" />
        <DollarSign className="absolute left-[85%] text-primary/15 w-16 h-16 animate-float-5" />
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 mb-8 shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">Live Rates Updated: 2 mins ago</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Find the Best Exchange Rate <br />
            <span className="text-gradient-primary">in Seconds</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Compare exchange rates from leading Sri Lankan banks, analyze trends, receive intelligent forecasts, and make smarter currency exchange decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('platform-features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-background rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:-translate-y-1">
              Explore Platform <ArrowRight className="h-5 w-5" />
            </button>
            <Link 
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-surface border border-white/10 hover:bg-white/5 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Floating Mini Mockups & Responsive Rate Cards */}
        <div className="mt-16 md:mt-20 relative mx-auto max-w-5xl h-auto md:h-64">
          {/* Main Chart Mockup - hidden on mobile/tablet, shown on desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-full glass-panel rounded-xl p-6 transform hover:-translate-y-2 transition-transform duration-500 shadow-2xl border-t border-white/20">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold flex items-center gap-2"><DollarSign className="h-5 w-5 text-accent"/> USD/LKR Forecast</h3>
                <span className="text-accent text-sm font-medium flex items-center gap-1"><TrendingUp className="h-4 w-4"/> +1.2% Expected</span>
             </div>
             {/* Mock Chart Area */}
             <div className="h-32 w-full flex items-end gap-2 px-2">
                {[40, 50, 45, 60, 55, 75, 80, 70, 85, 95].map((height, i) => (
                   <div key={i} className="flex-1 bg-gradient-to-t from-primary/20 to-primary/60 rounded-t-sm" style={{ height: `${height}%` }}></div>
                ))}
             </div>
          </div>

          {/* Rate Cards - stacked/row on mobile/tablet, absolute on md+ */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch md:contents mt-8 md:mt-0">
            <div className="w-full sm:w-72 md:w-64 glass-panel rounded-xl p-5 shadow-xl md:absolute md:-left-12 md:top-24 md:rotate-[-5deg] md:animate-[blob_7s_infinite_alternate]">
              <div className="text-xs text-slate-400 mb-1 font-medium tracking-wide uppercase">Highest Buy Rate</div>
              <div className="text-2xl font-bold text-accent mb-2">{bestBuy ? bestBuy.buyRate.toFixed(2) : '--'} LKR</div>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-slate-300 font-semibold">{bestBuy ? bestBuy.bankName : 'Loading...'}</span>
                <span className="text-[10px] text-slate-400 font-medium">(Best if you're selling USD)</span>
              </div>
            </div>

            <div className="w-full sm:w-72 md:w-64 glass-panel rounded-xl p-5 shadow-xl md:absolute md:-right-12 md:top-16 md:rotate-[5deg] md:animate-[blob_8s_infinite_alternate_reverse]">
              <div className="text-xs text-slate-400 mb-1 font-medium tracking-wide uppercase">Lowest Sell Rate</div>
              <div className="text-2xl font-bold text-primary mb-2">{bestSell ? bestSell.sellRate.toFixed(2) : '--'} LKR</div>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-slate-300 font-semibold">{bestSell ? bestSell.bankName : 'Loading...'}</span>
                <span className="text-[10px] text-slate-400 font-medium">(Best if you're buying USD)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
