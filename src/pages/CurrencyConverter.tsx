import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, History, Clock, Star, Trophy, AlertCircle } from 'lucide-react';

const bankResults = [
  { bank: 'Commercial Bank', amount: '30,150.00 LKR', rate: '301.50', diff: '+220 LKR', best: true },
  { bank: 'HNB', amount: '30,100.00 LKR', rate: '301.00', diff: '+170 LKR', best: false },
  { bank: 'Sampath Bank', amount: '30,090.00 LKR', rate: '300.90', diff: '+160 LKR', best: false },
  { bank: 'BOC', amount: '30,050.00 LKR', rate: '300.50', diff: '+120 LKR', best: false },
  { bank: 'NDB', amount: '29,930.00 LKR', rate: '299.30', diff: 'Base', best: false },
];

const history = [
  { from: '1,000 USD', to: 'LKR', date: '2 hours ago', favorite: true },
  { from: '500 EUR', to: 'LKR', date: 'Yesterday', favorite: false },
  { from: '10,000 LKR', to: 'AUD', date: '2 days ago', favorite: true },
];

const CurrencyConverter = () => {
  const [fromAmount, setFromAmount] = useState('100');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Currency Converter</h1>
        <p className="text-slate-400">Determine where you receive the highest value for your currency exchange across all major Sri Lankan banks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Conversion Form */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 relative">
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
              <ArrowRightLeft className="h-32 w-32 text-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end relative z-10">
              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-medium">From</label>
                <div className="flex bg-surface border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
                  <input 
                    type="number" 
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="bg-transparent w-full p-4 text-white font-bold text-lg focus:outline-none"
                  />
                  <select className="bg-white/5 border-l border-white/10 px-4 text-white font-semibold focus:outline-none cursor-pointer">
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center pb-3">
                <button className="bg-surface border border-white/10 hover:border-primary/50 p-3 rounded-full text-primary hover:bg-primary/10 transition-all shadow-lg transform hover:scale-110">
                  <ArrowRightLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-medium">To</label>
                <div className="flex bg-surface border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-transparent w-full p-4 text-slate-500 font-bold text-lg flex items-center">
                    Converted Amount
                  </div>
                  <select className="bg-white/5 border-l border-white/10 px-4 text-white font-semibold focus:outline-none cursor-pointer">
                    <option>LKR</option>
                    <option>USD</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button className="bg-primary hover:bg-primary-dark text-background font-bold text-lg px-12 py-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:-translate-y-1 transition-all w-full md:w-auto">
                Convert Currency
              </button>
            </div>
          </div>

          {/* Section 2: Best Conversion Result */}
          <div className="bg-gradient-to-br from-surface to-surface/40 p-1 rounded-2xl">
            <div className="bg-[#111827] rounded-xl p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-[50px] rounded-full"></div>
              
              <div className="flex items-center gap-2 text-primary font-semibold mb-6">
                <Trophy className="h-5 w-5" /> Best Value Found
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <div className="text-slate-400 mb-1">{fromAmount} USD equals</div>
                  <div className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">30,150.00 LKR</div>
                  <div className="text-accent font-medium bg-accent/10 px-3 py-1 rounded-full inline-block text-sm">
                    Savings: +220 LKR vs lowest rate
                  </div>
                </div>
                
                <div className="bg-surface border border-white/10 rounded-xl p-6 text-center min-w-[200px]">
                  <div className="text-sm text-slate-400 mb-1">Recommended Bank</div>
                  <div className="text-xl font-bold text-white mb-2">Commercial Bank</div>
                  <div className="text-sm text-primary font-medium">Rate: 301.50</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Bank Comparison Results */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-4">Bank Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-sm">
                    <th className="pb-3 font-medium">Bank</th>
                    <th className="pb-3 font-medium text-right">Converted Amount</th>
                    <th className="pb-3 font-medium text-right">Exchange Rate</th>
                    <th className="pb-3 font-medium text-right">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {bankResults.map((result, index) => (
                    <tr key={index} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${result.best ? 'bg-primary/5' : ''}`}>
                      <td className="py-4 text-white font-medium flex items-center gap-2">
                        {result.best && <Trophy className="h-4 w-4 text-primary" />}
                        {result.bank}
                      </td>
                      <td className={`py-4 text-right font-bold ${result.best ? 'text-primary' : 'text-white'}`}>{result.amount}</td>
                      <td className="py-4 text-right text-slate-300">{result.rate}</td>
                      <td className="py-4 text-right">
                        <span className={`text-sm font-medium px-2 py-1 rounded ${result.best ? 'bg-primary/20 text-primary' : result.diff === 'Base' ? 'bg-surface text-slate-400' : 'bg-accent/10 text-accent'}`}>
                          {result.diff}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* Section 5: Smart Recommendation */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[40px] rounded-full"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-white">Smart Recommendation</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="text-slate-300 text-sm leading-relaxed">
                <strong className="text-white">Commercial Bank</strong> is highly recommended for this transaction.
              </div>
              <div className="bg-surface p-4 rounded-xl border border-white/5 text-sm text-slate-400 leading-relaxed">
                <strong>Reason:</strong> They currently provide the highest return for USD to LKR conversion. Rates have been stable at this level for the past 2 hours.
              </div>
              <button className="w-full bg-surface hover:bg-white/5 border border-white/10 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Set Alert for this Rate
              </button>
            </div>
          </div>

          {/* Section 4: Conversion History */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Recent Conversions
              </h3>
            </div>
            <div className="space-y-3">
              {history.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-transparent hover:border-white/5 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <button className={`${item.favorite ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'} transition-colors`}>
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                    <div>
                      <div className="text-white font-medium text-sm">{item.from} → {item.to}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {item.date}
                      </div>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary-dark p-2 bg-primary/10 rounded-lg transition-colors">
                    <ArrowRightLeft className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <button className="text-sm text-slate-400 hover:text-white transition-colors">
                View Full History
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
