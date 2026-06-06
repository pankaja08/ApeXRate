import React from 'react';
import { Database, LineChart, Cpu, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: 'Step 1',
    icon: <Database className="h-8 w-8 text-primary" />,
    title: 'We collect exchange rates from banks.',
  },
  {
    step: 'Step 2',
    icon: <LineChart className="h-8 w-8 text-accent" />,
    title: 'We analyze historical trends.',
  },
  {
    step: 'Step 3',
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: 'Our forecasting engine predicts future rates.',
  },
  {
    step: 'Step 4',
    icon: <CheckCircle className="h-8 w-8 text-accent" />,
    title: 'Users make informed decisions.',
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative z-10 bg-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How <span className="text-gradient-accent">It Works</span></h2>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative">
            {steps.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{item.step}</div>
                <div className="bg-background border-2 border-white/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 relative z-10 group-hover:border-primary/50 transition-colors shadow-xl">
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium text-white max-w-[200px]">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
