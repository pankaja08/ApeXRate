import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Calculator, LineChart } from 'lucide-react';

const features = [
  {
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
    title: 'Smart Dashboard',
    description: 'Get a bird\'s-eye view of the market. Instantly see the best exchange rates today, top currency cards, and trending pairs.',
    delay: '0'
  },
  {
    icon: <ArrowLeftRight className="h-6 w-6 text-accent" />,
    title: 'Rate Comparison',
    description: 'Compare buy and sell rates across top Sri Lankan banks like Commercial, Sampath, HNB, and BOC at a glance.',
    delay: '100'
  },
  {
    icon: <Calculator className="h-6 w-6 text-primary" />,
    title: 'Currency Converter',
    description: 'Calculate exactly how much you\'ll receive or need to pay. We instantly show you which bank gives you the most value.',
    delay: '200'
  },
  {
    icon: <LineChart className="h-6 w-6 text-accent" />,
    title: 'Historical Analysis',
    description: 'Make informed decisions with up to 1-year of historical data. View interactive charts for highest, lowest, and average rates.',
    delay: '300'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to <span className="text-gradient-accent">Exchange Smartly</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            ApexRate provides powerful tools to help you track, compare, and forecast currency exchange rates with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 group hover:border-primary/30"
            >
              <div className="bg-surface/80 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-white/5 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
