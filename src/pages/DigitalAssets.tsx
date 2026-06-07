import React, { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CryptoPrice {
  symbol: string;
  price: number;
}

const cryptoLogos: Record<string, { name: string; url: string; color: string }> = {
  'BTC': { name: 'Bitcoin', url: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png', color: '#F7931A' },
  'ETH': { name: 'Ethereum', url: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png', color: '#627EEA' },
  'BNB': { name: 'BNB', url: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png', color: '#F3BA2F' },
  'SOL': { name: 'Solana', url: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png', color: '#14F195' },
  'ADA': { name: 'Cardano', url: 'https://assets.coingecko.com/coins/images/975/standard/cardano.png', color: '#0033AD' },
  'XRP': { name: 'Ripple', url: 'https://assets.coingecko.com/coins/images/44/standard/xrp-symbol-white-128.png', color: '#23292F' }
};

const historicalData = [
  { name: 'Mon', rate: 61200 }, { name: 'Tue', rate: 62400 }, { name: 'Wed', rate: 61800 },
  { name: 'Thu', rate: 63500 }, { name: 'Fri', rate: 64200 }, { name: 'Sat', rate: 63900 }, { name: 'Sun', rate: 65100 }
];

const DigitalAssets = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [lkrRate, setLkrRate] = useState<number>(300); // Default fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch USD/LKR rate from backend once
    fetch('http://localhost:8080/api/v1/rates/latest?currencyPair=USD/LKR')
      .then(res => res.json())
      .then(data => {
        if (data.rates && data.rates.length > 0) {
          // Find the Global API rate for the most accurate baseline, or just use the first bank
          const global = data.rates.find((r: any) => r.bankName === 'Global API');
          setLkrRate(global ? global.buyRate : data.rates[0].buyRate);
        }
      })
      .catch(console.error);

    // 2. Poll Binance API every 2 seconds for ultra-fast updates
    const fetchBinance = () => {
      fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT","ADAUSDT","XRPUSDT"]')
        .then(res => res.json())
        .then((data: any[]) => {
          const newPrices: Record<string, number> = {};
          data.forEach(item => {
            const coin = item.symbol.replace('USDT', '');
            newPrices[coin] = parseFloat(item.price);
          });
          setPrices(newPrices);
          setLoading(false);
        })
        .catch(console.error);
    };

    fetchBinance(); // initial fetch
    const interval = setInterval(fetchBinance, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Digital Assets</h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Track high-frequency global market prices for top cryptocurrencies. Updates live every 2 seconds.
        </p>
      </div>

      {/* Digital Assets Grid */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></div>
              Live Markets
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Compare live cryptocurrency values directly in LKR and USD, powered by Binance Public API.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search Asset..." className="bg-[#0f172a] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 w-full sm:w-48" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 relative z-10">
          {loading ? (
            <div className="col-span-full text-center text-slate-400 py-10">Connecting to live socket...</div>
          ) : (
            Object.keys(cryptoLogos).map(coin => {
              const usdPrice = prices[coin] || 0;
              const lkrPrice = usdPrice * lkrRate;
              const logo = cryptoLogos[coin];
              
              // Formatting rules based on price size
              const formatOptions = usdPrice < 1 
                ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } 
                : { minimumFractionDigits: 2, maximumFractionDigits: 2 };

              return (
                <div key={coin} className="glass-card p-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group" style={{ '--tw-border-opacity': '0.3', borderColor: `var(--tw-border-color, ${logo.color})` } as React.CSSProperties}>
                  <img src={logo.url} alt={logo.name} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/10 group-hover:scale-105 transition-transform" />
                  <div className="flex-1">
                    <div className="text-slate-200 font-bold text-xs mb-1.5">{logo.name} ({coin})</div>
                    <div className="flex justify-between items-center text-[11px]">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Price (LKR)</span>
                        <span className="text-accent font-bold tracking-tight">{(lkrPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block mb-0.5">Price (USD)</span>
                        <span className="text-white font-bold tracking-tight">${usdPrice.toLocaleString(undefined, formatOptions)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Historical Analysis */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 relative overflow-hidden mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Historical Analysis</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Track asset fluctuation over time to identify macro trends.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none">
              <option>BTC/USD</option>
              <option>ETH/USD</option>
              <option>SOL/USD</option>
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
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Highest Price (7D)</div>
              <div className="text-lg font-bold text-white">$65,100.00</div>
            </div>
            <div className="glass-card p-3.5">
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Lowest Price (7D)</div>
              <div className="text-lg font-bold text-white">$61,200.00</div>
            </div>
            <div className="glass-card p-3.5">
              <div className="text-xs text-slate-400 mb-0.5 font-medium">Average Price</div>
              <div className="text-lg font-bold text-white">$63,157.00</div>
            </div>
          </div>
          <div className="md:col-span-4 h-60 w-full bg-[#0f172a]/40 rounded-xl border border-white/5 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7931A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F7931A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1e293b', borderRadius: '8px', padding: '8px' }} itemStyle={{ color: '#F7931A', fontWeight: 'bold', fontSize: '14px' }} />
                <Area type="monotone" dataKey="rate" stroke="#F7931A" strokeWidth={2} fillOpacity={1} fill="url(#colorCrypto)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalAssets;
