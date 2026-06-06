import React from 'react';
import { ArrowLeftRight, TrendingUp, BellRing } from 'lucide-react';

const reasons = [
  {
    icon: <ArrowLeftRight className="h-6 w-6 text-primary" />,
    title: 'Compare Rates',
    description: 'Instantly compare rates from multiple banks.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-accent" />,
    title: 'Forecast Trends',
    description: 'Predict exchange rate movements using AI.',
  },
  {
    icon: <BellRing className="h-6 w-6 text-primary" />,
    title: 'Personalized Alerts',
    description: 'Receive notifications when target rates are reached.',
  }
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-24 relative z-10 bg-surface/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose <span className="text-gradient-accent">RateMatrix</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We provide the most powerful tools to help you track, compare, and forecast currency exchange rates with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 group hover:border-primary/30 text-center"
            >
              <div className="bg-surface/80 w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:bg-white/5 transition-colors">
                {reason.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{reason.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
