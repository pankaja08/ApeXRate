import React from 'react';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="glass-panel p-12 md:p-16 rounded-3xl border border-white/10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Ready to Make Smarter <br /> <span className="text-gradient-primary">Exchange Decisions?</span>
          </h2>
          <button className="px-8 py-4 bg-primary hover:bg-primary-dark text-[#0B0F19] rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:-translate-y-1 inline-flex items-center gap-2">
            Create Free Account <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
