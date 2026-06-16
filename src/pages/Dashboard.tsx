import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, Sparkles, Info, Building2, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LoadingOverlay from '../components/layout/LoadingOverlay';

interface BankRate {
  bankName: string;
  bankLogo: string;
  buyRate: number;
  sellRate: number;
  lastUpdated: string;
}

interface UserProfile {
  preferredBank?: string;
  preferredFiatCurrency?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [banks, setBanks] = useState<BankRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedRange, setSelectedRange] = useState('7D');
  const [chartData, setChartData] = useState<{ name: string; rate: number }[]>([]);
  const [historyStats, setHistoryStats] = useState({ highestRate: 0, lowestRate: 0, averageRate: 0 });
  const [chartLoading, setChartLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [preferredBankRate, setPreferredBankRate] = useState<BankRate | null>(null);
  const [prefRateLoading, setPrefRateLoading] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    if (user?.token) {
      fetch('http://localhost:8080/api/v1/user/profile', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setUserProfile(data);
        })
        .catch(() => {});
    }
  }, [user]);

  // Fetch preferred bank rate when profile is loaded
  useEffect(() => {
    if (userProfile?.preferredBank && userProfile?.preferredFiatCurrency) {
      setPrefRateLoading(true);
      fetch(`http://localhost:8080/api/v1/rates/latest?currencyPair=${userProfile.preferredFiatCurrency}/LKR`)
        .then(res => res.json())
        .then(data => {
          const rates: BankRate[] = data.rates || [];
          const match = rates.find(r => r.bankName === userProfile.preferredBank);
          setPreferredBankRate(match || null);
          setPrefRateLoading(false);
        })
        .catch(() => setPrefRateLoading(false));
    }
  }, [userProfile]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/v1/rates/latest?currencyPair=${selectedCurrency}/LKR`)
      .then(res => res.json())
      .then(data => {
        setBanks(data.rates || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch rates", err);
        setLoading(false);
      });
  }, [selectedCurrency]);

  useEffect(() => {
    setChartLoading(true);
    fetch(`http://localhost:8080/api/v1/rates/history?currencyPair=${selectedCurrency}/LKR&range=${selectedRange}`)
      .then(res => res.json())
      .then(data => {
        if (data.points) {
          const points = data.points.map((p: any) => ({
            name: p.name,
            rate: parseFloat(p.rate)
          }));
          setChartData(points);
          setHistoryStats({
            highestRate: parseFloat(data.highestRate) || 0,
            lowestRate: parseFloat(data.lowestRate) || 0,
            averageRate: parseFloat(data.averageRate) || 0
          });
        }
        setChartLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch historical rates", err);
        setChartLoading(false);
      });
  }, [selectedCurrency, selectedRange]);

  const localBanks = banks.filter(b => b.bankName !== 'Global API');
  const bestBuy = localBanks.length > 0 ? localBanks.reduce((max, bank) => bank.buyRate > max.buyRate ? bank : max) : null;
  const bestSell = localBanks.length > 0 ? localBanks.reduce((min, bank) => bank.sellRate < min.sellRate ? bank : min) : null;

  // Determine if we should show personalized card
  const hasPreferences = user && userProfile?.preferredBank && userProfile?.preferredFiatCurrency;

  return (
    <>
      {loading && <LoadingOverlay message="Fetching latest market exchange rates..." />}
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
            <div className="text-xs text-slate-400 mb-1 font-medium tracking-wide uppercase">Best {selectedCurrency} Buy (LKR)</div>
            <div className="text-2xl font-bold text-accent mb-2">{bestBuy ? bestBuy.buyRate.toFixed(2) : '--'}</div>
            <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
              {bestBuy ? <><img src={bestBuy.bankLogo} className="w-5 h-5 rounded" alt={bestBuy.bankName} /> {bestBuy.bankName}</> : 'Loading...'}
            </div>
          </div>
          
          <div className="glass-card glow-border-cyan p-4 flex flex-col justify-center border-l-2 border-l-primary/50 group hover:border-primary transition-colors">
            <div className="text-xs text-slate-400 mb-1 font-medium tracking-wide uppercase">Best {selectedCurrency} Sell (LKR)</div>
            <div className="text-2xl font-bold text-primary mb-2">{bestSell ? bestSell.sellRate.toFixed(2) : '--'}</div>
            <div className="text-xs text-slate-300 font-medium flex items-center gap-2">
              {bestSell ? <><img src={bestSell.bankLogo} className="w-5 h-5 rounded" alt={bestSell.bankName} /> {bestSell.bankName}</> : 'Loading...'}
            </div>
          </div>
          
          <div className="glass-card p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-primary/20 rounded-md"><Sparkles className="h-3 w-3 text-primary" /></div>
              <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Most Active</div>
            </div>
            <div className="text-xl font-bold text-white mb-1">{selectedCurrency}/LKR</div>
            <div className="text-xs text-accent font-medium">+0.75% Daily</div>
          </div>
          
          {/* 4th Card: Personalized or Market Trend fallback */}
          {hasPreferences ? (
            <div className="glass-card p-4 flex flex-col justify-center border-l-2 border-l-yellow-400/50 group hover:border-yellow-400 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-yellow-400/20 rounded-md"><Star className="h-3 w-3 text-yellow-400" /></div>
                <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Your Bank</div>
              </div>
              {prefRateLoading ? (
                <div className="text-sm text-slate-400">Loading...</div>
              ) : preferredBankRate ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={preferredBankRate.bankLogo} className="w-6 h-6 rounded bg-white" alt={preferredBankRate.bankName} />
                    <div className="text-sm font-bold text-white truncate">{preferredBankRate.bankName}</div>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Buy</span>
                      <span className="text-accent font-bold text-sm">{preferredBankRate.buyRate.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block mb-0.5">Sell</span>
                      <span className="text-primary font-bold text-sm">{preferredBankRate.sellRate.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1.5 font-medium">{userProfile?.preferredFiatCurrency}/LKR</div>
                </>
              ) : (
                <div className="text-sm text-slate-400">
                  <p className="text-white font-medium text-xs">{userProfile?.preferredBank}</p>
                  <p className="text-[10px] text-slate-500 mt-1">No rate data for {userProfile?.preferredFiatCurrency}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-4 flex flex-col justify-center">
              {user ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-yellow-400/20 rounded-md"><Star className="h-3 w-3 text-yellow-400" /></div>
                    <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Personalize</div>
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Set Your Preferences</div>
                  <Link to="/profile" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                    Go to Profile →
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-white/10 rounded-md"><TrendingUp className="h-3 w-3 text-white" /></div>
                    <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Market Trend</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">Bullish</div>
                  <div className="text-xs text-slate-500 font-medium">Based on 30-day average</div>
                </>
              )}
            </div>
          )}
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
             <select 
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50"
             >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="SGD">SGD</option>
            </select>
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search Bank..." className="bg-[#0f172a] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 w-full sm:w-48" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 relative z-10">
          {loading ? (
            <div className="col-span-full text-center text-slate-400 py-10">Loading live rates...</div>
          ) : banks.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-10">No rates available for this currency pair yet.</div>
          ) : (
            banks.map((bank, index) => (
              <div key={index} className="glass-card p-3 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer group">
                <img src={bank.bankLogo} alt={bank.bankName} className="w-10 h-10 rounded-lg bg-white border border-white/10 group-hover:scale-105 transition-transform" />
                <div className="flex-1">
                  <div className="text-slate-200 font-bold text-xs mb-1.5">{bank.bankName}</div>
                  <div className="flex justify-between items-center text-[11px]">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Buy Rate</span>
                      <span className="text-accent font-bold">{bank.buyRate.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block mb-0.5">Sell Rate</span>
                      <span className="text-primary font-bold">{bank.sellRate.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1.5 font-medium">Last Updated: {bank.lastUpdated}</div>
                </div>
              </div>
            ))
          )}
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
            <select 
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50"
            >
              <option value="USD">USD/LKR</option>
              <option value="EUR">EUR/LKR</option>
              <option value="GBP">GBP/LKR</option>
              <option value="JPY">JPY/LKR</option>
              <option value="AUD">AUD/LKR</option>
              <option value="SGD">SGD/LKR</option>
            </select>
            <div className="flex bg-[#0f172a] border border-white/10 rounded-lg p-0.5">
              {['7D', '30D', '90D', '1Y', '5Y'].map((range) => (
                <button 
                  key={range} 
                  onClick={() => setSelectedRange(range)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${selectedRange === range ? 'bg-primary text-background font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="glass-card p-3.5">
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Highest Rate ({selectedRange})</div>
              <div className="text-lg font-bold text-white">{chartLoading ? '...' : historyStats.highestRate.toFixed(2)}</div>
            </div>
            <div className="glass-card p-3.5">
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Lowest Rate ({selectedRange})</div>
              <div className="text-lg font-bold text-white">{chartLoading ? '...' : historyStats.lowestRate.toFixed(2)}</div>
            </div>
            <div className="glass-card p-3.5">
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Average Rate</div>
              <div className="text-lg font-bold text-white">{chartLoading ? '...' : historyStats.averageRate.toFixed(2)}</div>
            </div>
          </div>
          <div className={`md:col-span-4 h-60 w-full bg-[#0f172a]/40 rounded-xl border border-white/5 p-3 transition-opacity duration-200 ${chartLoading ? 'opacity-50' : 'opacity-100'}`}>
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
    </>
  );
};

export default Dashboard;

