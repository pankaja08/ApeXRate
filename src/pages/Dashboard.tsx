import React from 'react';
import { TrendingUp, Search, Sparkles, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', rate: 298.5 }, { name: 'Tue', rate: 299.2 }, { name: 'Wed', rate: 299.8 },
  { name: 'Thu', rate: 300.5 }, { name: 'Fri', rate: 301.2 }, { name: 'Sat', rate: 303.0 }, { name: 'Sun', rate: 304.5 }
];

const banks = [
  { name: 'Commercial Bank', buy: '301.50', sell: '305.50', updated: '2 mins ago', logo: 'https://placehold.co/60x60/1e293b/fff?text=CB' },
  { name: 'Sampath Bank', buy: '300.90', sell: '304.50', updated: '5 mins ago', logo: 'https://placehold.co/60x60/1e293b/fff?text=SB' },
  { name: 'HNB', buy: '301.00', sell: '304.20', updated: '1 min ago', logo: 'https://placehold.co/60x60/1e293b/fff?text=HNB' },
  { name: 'BOC', buy: '300.50', sell: '305.00', updated: '10 mins ago', logo: 'https://placehold.co/60x60/1e293b/fff?text=BOC' },
  { name: 'Hasinn Bank', buy: '300.90', sell: '304.50', updated: '2 mins ago', logo: 'https://placehold.co/60x60/1e293b/fff?text=HB' },
  { name: 'Bitsita Bank', buy: '300.90', sell: '304.50', updated: '10 mins ago', logo: 'https://placehold.co/60x60/1e293b/fff?text=BB' },
  { name: 'Porinata Bank', buy: '300.90', sell: '304.50', updated: '10 mins ago', logo: 'https://placehold.co/60x60/1e293b/fff?text=PB' },
  { name: 'SIMT', buy: '300.90', sell: '304.50', updated: '1 min ago', logo: 'https://placehold.co/60x60/1e293b/fff?text=SM' },
];

const Dashboard = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-10">
      
      {/* Top Section - Summary Cards Layout */}
      <div>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Market Overview</h1>
          <p className="text-sm text-slate-400 max-w-3xl flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            Quickly glance at the best performing banks for USD exchanges today and see the overall market trajectory.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4 flex flex-col justify-center border-l-2 border-l-accent/50 group hover:border-accent transition-colors">
            <div className="text-xs text-slate-400 mb-1 font-medium tracking-wide uppercase">Best USD Buy (LKR)</div>
            <div className="text-2xl font-bold text-accent mb-2">301.50</div>
            <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
              <img src="https://placehold.co/40x40/1e293b/fff?text=CB" className="w-5 h-5 rounded" alt="CB" /> Commercial Bank
            </div>
          </div>
          
          <div className="glass-card glow-border-cyan p-4 flex flex-col justify-center border-l-2 border-l-primary/50 group hover:border-primary transition-colors">
            <div className="text-xs text-slate-400 mb-1 font-medium tracking-wide uppercase">Best USD Sell (LKR)</div>
            <div className="text-2xl font-bold text-primary mb-2">304.20</div>
            <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
              <img src="https://placehold.co/40x40/1e293b/fff?text=HNB" className="w-5 h-5 rounded" alt="HNB" /> HNB
            </div>
          </div>
          
          <div className="glass-card p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-primary/20 rounded-md"><Sparkles className="h-3 w-3 text-primary" /></div>
              <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Most Active</div>
            </div>
            <div className="text-xl font-bold text-white mb-1">USD/LKR</div>
            <div className="text-xs text-accent font-medium">+0.75% Daily</div>
          </div>
          
          <div className="glass-card p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-white/10 rounded-md"><TrendingUp className="h-3 w-3 text-white" /></div>
              <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Market Trend</div>
            </div>
            <div className="text-xl font-bold text-white mb-1">Bullish</div>
            <div className="text-xs text-slate-500 font-medium">Based on 30-day average</div>
          </div>
        </div>
      </div>

      {/* Compare Rates Bank Grid */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Compare Rates</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Monitor live exchange rates across all registered banks. The green Buy Rate indicates how much the bank pays you, while the cyan Sell Rate indicates how much the bank charges you.
            </p>
          </div>
          <div className="flex gap-2">
             <select className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search Bank..." className="bg-[#0f172a] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 w-full sm:w-48" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 relative z-10">
          {banks.map((bank, index) => (
            <div key={index} className="glass-card p-3 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer group">
              <img src={bank.logo} alt={bank.name} className="w-10 h-10 rounded-lg bg-white border border-white/10 group-hover:scale-105 transition-transform" />
              <div className="flex-1">
                <div className="text-slate-200 font-bold text-xs mb-1.5">{bank.name}</div>
                <div className="flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Buy Rate</span>
                    <span className="text-accent font-bold">{bank.buy}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block mb-0.5">Sell Rate</span>
                    <span className="text-primary font-bold">{bank.sell}</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-600 mt-1.5 font-medium">Last Updated: {bank.updated}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Analysis */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Historical Analysis</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Track currency fluctuation over time to identify trends and decide the best moment to exchange your money.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none">
              <option>USD/LKR</option>
              <option>EUR/LKR</option>
            </select>
            <div className="flex bg-[#0f172a] border border-white/10 rounded-lg p-0.5">
              {['7D', '30D', '90D', '1Y', '5Y'].map((range, i) => (
                <button key={i} className={`px-3 py-1 text-xs rounded-md transition-colors ${i === 0 ? 'bg-primary text-background font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}>
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="glass-card p-3.5">
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Highest Rate (7D)</div>
              <div className="text-lg font-bold text-white">304.50</div>
            </div>
            <div className="glass-card p-3.5">
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Lowest Rate (7D)</div>
              <div className="text-lg font-bold text-white">298.50</div>
            </div>
            <div className="glass-card p-3.5">
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Average Rate</div>
              <div className="text-lg font-bold text-white">301.25</div>
            </div>
          </div>
          <div className="md:col-span-4 h-60 w-full bg-[#0f172a]/40 rounded-xl border border-white/5 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1e293b', borderRadius: '8px', padding: '8px' }} itemStyle={{ color: '#00F0FF', fontWeight: 'bold', fontSize: '14px' }} />
                <Area type="monotone" dataKey="rate" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#colorHistorical)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
