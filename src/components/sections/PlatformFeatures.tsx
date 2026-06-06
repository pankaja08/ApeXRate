import React from 'react';
import { 
  ArrowLeftRight, Calculator, LineChart, Cpu, 
  Bell, LayoutDashboard, ThumbsUp, BarChart3 
} from 'lucide-react';

const features = [
  { icon: <ArrowLeftRight className="h-6 w-6 text-primary" />, title: 'Real-Time Comparison' },
  { icon: <Calculator className="h-6 w-6 text-accent" />, title: 'Currency Converter' },
  { icon: <LineChart className="h-6 w-6 text-primary" />, title: 'Historical Analysis' },
  { icon: <Cpu className="h-6 w-6 text-accent" />, title: 'AI Forecasting' },
  { icon: <Bell className="h-6 w-6 text-primary" />, title: 'Alerts' },
  { icon: <LayoutDashboard className="h-6 w-6 text-accent" />, title: 'Personalized Dashboard' },
  { icon: <ThumbsUp className="h-6 w-6 text-primary" />, title: 'Best Bank Recommendations' },
  { icon: <BarChart3 className="h-6 w-6 text-accent" />, title: 'Analytics' }
];

const PlatformFeatures = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform <span className="text-gradient-primary">Features</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Everything you need to make the smartest currency exchange decisions, built into one seamless platform.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel p-6 rounded-xl hover:-translate-y-1 transition-all duration-300 group hover:border-primary/30 flex flex-col items-center justify-center text-center gap-4 cursor-pointer"
            >
              <div className="bg-surface/80 p-3 rounded-lg border border-white/5 group-hover:bg-white/5 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-sm md:text-base font-medium text-white">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
