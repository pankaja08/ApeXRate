import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';

const data = [
  { name: 'Mon', rate: 298.5 },
  { name: 'Tue', rate: 299.2 },
  { name: 'Wed', rate: 299.8 },
  { name: 'Thu', rate: 300.5 },
  { name: 'Fri', rate: 301.2 },
  { name: 'Sat', rate: 303.0 },
  { name: 'Sun', rate: 304.5 },
];

const banks = [
  { name: 'Commercial Bank', buy: '301.20', sell: '305.50', bestBuy: true, bestSell: false },
  { name: 'Sampath Bank', buy: '300.90', sell: '303.50', bestBuy: false, bestSell: true },
  { name: 'HNB', buy: '301.00', sell: '304.80', bestBuy: false, bestSell: false },
  { name: 'BOC', buy: '300.50', sell: '305.00', bestBuy: false, bestSell: false },
];

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState('usd');

  return (
    <section id="compare" className="py-24 relative z-10 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Real-Time <br /> <span className="text-gradient-primary">Market Intelligence</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Experience a dashboard built for precision. We aggregate rates from every major Sri Lankan bank so you can easily spot the best value for your currency exchanges.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                <span className="text-slate-300">Live rate updates from 10+ banks</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                <span className="text-slate-300">AI-powered 7-day trend forecasts</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                <span className="text-slate-300">Instant "Best Buy" & "Best Sell" highlighting</span>
              </li>
            </ul>
            
            <button className="flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors">
              Explore Full Dashboard <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Interactive Mockup */}
          <div className="lg:w-2/3 w-full">
            <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-white/10 relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2 bg-surface p-1 rounded-lg border border-white/5">
                  <button 
                    onClick={() => setActiveTab('usd')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'usd' ? 'bg-primary text-background' : 'text-slate-400 hover:text-white'}`}
                  >
                    USD / LKR
                  </button>
                  <button 
                    onClick={() => setActiveTab('eur')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'eur' ? 'bg-primary text-background' : 'text-slate-400 hover:text-white'}`}
                  >
                    EUR / LKR
                  </button>
                </div>
                
                <button className="flex items-center gap-2 text-sm text-slate-300 bg-surface px-4 py-2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors">
                  Last 7 Days <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Chart */}
              <div className="h-64 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#00F0FF' }}
                    />
                    <Area type="monotone" dataKey="rate" stroke="#00F0FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-sm">
                      <th className="pb-3 font-medium">Bank</th>
                      <th className="pb-3 font-medium text-right">We Buy (LKR)</th>
                      <th className="pb-3 font-medium text-right">We Sell (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banks.map((bank, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="py-4 text-white font-medium flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                            {bank.name.charAt(0)}
                          </div>
                          {bank.name}
                        </td>
                        <td className="py-4 text-right">
                          <span className={`font-semibold ${bank.bestBuy ? 'text-accent' : 'text-slate-300'}`}>
                            {bank.buy}
                          </span>
                          {bank.bestBuy && <span className="ml-2 text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full">BEST</span>}
                        </td>
                        <td className="py-4 text-right">
                          <span className={`font-semibold ${bank.bestSell ? 'text-primary' : 'text-slate-300'}`}>
                            {bank.sell}
                          </span>
                          {bank.bestSell && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">BEST</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
