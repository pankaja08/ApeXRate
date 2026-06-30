import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, Sparkles, History, Clock, Star, Trophy, AlertCircle, Check, Copy, ChevronDown, Search, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface BankRate {
  bankName: string;
  bankLogo: string;
  buyRate: number;
  sellRate: number;
  lastUpdated: string;
}

const history = [
  { from: '1,000 USD', to: 'LKR', date: '2 hours ago', favorite: true },
  { from: '500 EUR', to: 'LKR', date: 'Yesterday', favorite: false },
  { from: '10,000 LKR', to: 'AUD', date: '2 days ago', favorite: true },
];

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰' }
];

// Custom Currency Dropdown Component
interface CurrencyDropdownProps {
  value: string;
  onChange: (code: string) => void;
  currencies: typeof CURRENCIES;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({ value, onChange, currencies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCurrencies = currencies.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-[#111827] hover:bg-white/5 border-l border-white/10 px-3 h-full text-white font-semibold focus:outline-none cursor-pointer min-w-[100px] transition-colors rounded-r-xl"
      >
        <span className="flex items-center gap-1.5 text-xs md:text-sm">
          <span>{selectedCurrency.flag}</span>
          <span>{selectedCurrency.code}</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 glass-panel rounded-xl border border-white/10 shadow-2xl z-[100] overflow-hidden backdrop-blur-xl bg-[#111827]/95"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-white/5 flex items-center gap-2 bg-white/5">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-500 focus:ring-0 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10">
              {filteredCurrencies.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-primary/10 transition-colors text-xs ${c.code === value ? 'bg-primary/5 text-primary' : 'text-slate-300'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <div>
                      <div className={`font-semibold ${c.code === value ? 'text-primary' : 'text-white'}`}>{c.code}</div>
                      <div className="text-[10px] text-slate-500">{c.name}</div>
                    </div>
                  </span>
                  {c.code === value && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
              {filteredCurrencies.length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-slate-500">
                  No currencies found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CurrencyConverter = () => {
  const { user } = useAuth();
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('LKR');
  const [banks, setBanks] = useState<BankRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lastEdited, setLastEdited] = useState<'from' | 'to'>('from');

  const [userProfile, setUserProfile] = useState<any>(null);
  const [savedConversions, setSavedConversions] = useState<any[]>([]);
  const [savingConversion, setSavingConversion] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const fetchSavedConversions = async () => {
    if (!user?.token) return;
    try {
      const response = await fetch('http://localhost:8080/api/v1/conversions', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSavedConversions(data);
      }
    } catch (err) {
      console.error('Failed to fetch saved conversions', err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchSavedConversions();
    } else {
      setSavedConversions([]);
    }
  }, [user]);

  useEffect(() => {
    setSaved(false);
  }, [fromAmount, fromCurrency, toCurrency]);

  const handleSaveConversion = async () => {
    if (!bestResult || !fromAmount || !user?.token) return;
    setSavingConversion(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          fromCurrency,
          toCurrency,
          fromAmount: parseFloat(fromAmount),
          toAmount: parseFloat(toAmount),
          recommendedBank: bestResult.bank,
          rate: bestResult.rate
        })
      });
      if (response.ok) {
        setSaved(true);
        fetchSavedConversions();
      }
    } catch (err) {
      console.error('Failed to save conversion', err);
    } finally {
      setSavingConversion(false);
    }
  };

  const handleLoadSavedConversion = (item: any) => {
    setFromAmount(item.fromAmount.toString());
    setFromCurrency(item.fromCurrency);
    setToCurrency(item.toCurrency);
    setToAmount(item.toAmount.toString());
    setLastEdited('from');
  };

  const foreignCurrency = fromCurrency === 'LKR' ? toCurrency : fromCurrency;
  const pair = `${foreignCurrency}/LKR`;

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/v1/rates/latest?currencyPair=${pair}`)
      .then(res => res.json())
      .then(data => {
        setBanks(data.rates || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch rates", err);
        setLoading(false);
      });
  }, [pair]);

  const handleFromCurrencyChange = (code: string) => {
    setFromCurrency(code);
    if (code === 'LKR') {
      if (toCurrency === 'LKR') {
        setToCurrency('USD');
      }
    } else {
      setToCurrency('LKR');
    }
    setLastEdited('from');
  };

  const handleToCurrencyChange = (code: string) => {
    setToCurrency(code);
    if (code === 'LKR') {
      if (fromCurrency === 'LKR') {
        setFromCurrency('USD');
      }
    } else {
      setFromCurrency('LKR');
    }
    setLastEdited('from');
  };

  const handleSwap = () => {
    const tempCurr = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurr);

    if (lastEdited === 'from') {
      setFromAmount(toAmount);
      setLastEdited('from');
    } else {
      setToAmount(fromAmount);
      setLastEdited('to');
    }
  };

  const amountValue = parseFloat(fromAmount) || 0;
  const isFromLkr = fromCurrency === 'LKR';

  const localBanks = banks.filter(b => b.bankName !== 'Global API');
  const results = localBanks.map(bank => {
    const rate = isFromLkr ? bank.sellRate : bank.buyRate;
    const calculatedAmount = isFromLkr 
      ? (rate > 0 ? amountValue / rate : 0)
      : amountValue * rate;

    return {
      bank: bank.bankName,
      logo: bank.bankLogo,
      rate: rate,
      calculatedAmount: calculatedAmount
    };
  }).sort((a, b) => b.calculatedAmount - a.calculatedAmount);

  const bestResult = results.length > 0 ? results[0] : null;
  const lowestAmount = results.length > 0 ? results[results.length - 1].calculatedAmount : 0;

  // Synchronization logic for input fields
  useEffect(() => {
    if (lastEdited === 'from') {
      if (!fromAmount) {
        setToAmount('');
        return;
      }
      const val = parseFloat(fromAmount);
      if (isNaN(val)) return;
      if (bestResult) {
        setToAmount(bestResult.calculatedAmount.toFixed(2));
      } else {
        setToAmount('');
      }
    }
  }, [fromAmount, bestResult, lastEdited]);

  useEffect(() => {
    if (lastEdited === 'to') {
      if (!toAmount) {
        setFromAmount('');
        return;
      }
      const val = parseFloat(toAmount);
      if (isNaN(val)) return;
      if (bestResult && bestResult.rate > 0) {
        const rate = bestResult.rate;
        const calculated = isFromLkr ? (val * rate) : (val / rate);
        setFromAmount(calculated.toFixed(2));
      } else {
        setFromAmount('');
      }
    }
  }, [toAmount, bestResult, lastEdited, isFromLkr]);

  const bankResults = results.map(result => {
    const diffValue = result.calculatedAmount - lowestAmount;
    return {
      ...result,
      amount: `${result.calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`,
      rateDisplay: `1 ${isFromLkr ? toCurrency : fromCurrency} = ${result.rate.toFixed(2)} LKR (${isFromLkr ? 'Sell' : 'Buy'})`,
      diff: diffValue === 0 ? 'Base' : `+${diffValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`,
      best: result === bestResult
    };
  });

  const handleCopy = () => {
    if (!bestResult) return;
    const fromValFormatted = (parseFloat(fromAmount) || 0).toLocaleString();
    const toValFormatted = (parseFloat(toAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const text = `${fromValFormatted} ${fromCurrency} = ${toValFormatted} ${toCurrency} (Best Rate via ${bestResult.bank})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setFromAmount(val);
      setLastEdited('from');
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setToAmount(val);
      setLastEdited('to');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
      {/* Decorative radial background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Currency Converter</h1>
          <p className="text-slate-400 text-xs">Determine where you receive the highest value for your currency exchange across all major Sri Lankan banks.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Conversion Form */}
          <div className="glass-panel p-8 rounded-2xl border border-white/5 relative">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center relative z-30">
              
              {/* FROM SECTION */}
              <div className="space-y-1 relative z-30">
                <label className="text-xs text-slate-400 font-medium block">From</label>
                <div className="flex bg-surface border border-white/10 rounded-xl focus-within:border-primary/50 transition-colors h-[48px]">
                  <input 
                    type="text" 
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    placeholder="Enter amount"
                    className="bg-transparent w-full flex-1 min-w-0 px-3 text-white font-semibold text-sm focus:outline-none rounded-l-xl"
                  />
                  <CurrencyDropdown 
                    value={fromCurrency} 
                    onChange={handleFromCurrencyChange} 
                    currencies={CURRENCIES} 
                  />
                </div>
              </div>

              {/* SWAP BUTTON */}
              <div className="flex justify-center md:pt-5">
                <button 
                  onClick={handleSwap}
                  type="button"
                  title="Swap Currencies"
                  className="bg-surface border border-white/10 hover:border-primary/50 p-2.5 rounded-full text-primary hover:bg-primary/10 transition-all shadow-lg transform hover:scale-110 active:scale-95 duration-200"
                >
                  <ArrowRightLeft className="h-4 w-4 rotate-90 md:rotate-0 transition-transform" />
                </button>
              </div>

              {/* TO SECTION */}
              <div className="space-y-1 relative z-20">
                <label className="text-xs text-slate-400 font-medium block">To (Best Result)</label>
                <div className="flex bg-surface border border-white/10 rounded-xl focus-within:border-primary/50 transition-colors h-[48px]">
                  <input 
                    type="text" 
                    value={toAmount}
                    onChange={handleToAmountChange}
                    placeholder="Converted Amount"
                    className={`bg-transparent w-full flex-1 min-w-0 px-3 text-primary font-semibold text-sm focus:outline-none rounded-l-xl ${loading ? 'animate-pulse opacity-60' : ''}`}
                  />
                  <CurrencyDropdown 
                    value={toCurrency} 
                    onChange={handleToCurrencyChange} 
                    currencies={CURRENCIES} 
                  />
                </div>
              </div>
            </div>

            {/* LIVE EXCHANGE RATE INFO CARD */}
            {bestResult && !loading && (
              <div className="mt-6 flex justify-center">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs md:text-sm text-slate-300 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>1 {fromCurrency} = {bestResult.rate.toFixed(4)} {toCurrency} via <strong>{bestResult.bank}</strong></span>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={handleCopy}
                disabled={!bestResult || !fromAmount}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-8 py-3 rounded-xl border border-white/10 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Result
                  </>
                )}
              </button>

              {user && (
                <button 
                  onClick={handleSaveConversion}
                  disabled={!bestResult || !fromAmount || savingConversion}
                  className="bg-primary hover:bg-primary-dark text-background font-bold text-sm px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
                >
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved to Profile!
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      {savingConversion ? 'Saving...' : 'Save Conversion'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Best Conversion Result */}
          <div className="bg-gradient-to-br from-surface to-surface/40 p-1 rounded-2xl">
            <div className="bg-[#111827] rounded-xl p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-[50px] rounded-full"></div>
              
              <div className="flex items-center gap-2 text-primary font-semibold mb-4 text-sm">
                <Trophy className="h-4 w-4" /> Best Value Found
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <div className="text-slate-400 text-xs mb-1">{(parseFloat(fromAmount) || 0).toLocaleString()} {fromCurrency} equals</div>
                  <div className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                    {bestResult && toAmount ? `${(parseFloat(toAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}` : '--'}
                  </div>
                  {bestResult && toAmount && (bestResult.calculatedAmount - lowestAmount > 0) && (
                    <div className="text-accent font-medium bg-accent/10 px-3 py-1 rounded-full inline-block text-sm">
                      Savings: +{(bestResult.calculatedAmount - lowestAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency} vs lowest bank rate
                    </div>
                  )}
                </div>
                
                <div className="bg-surface border border-white/10 rounded-xl p-6 text-center min-w-[200px]">
                  <div className="text-sm text-slate-400 mb-1">Recommended Bank</div>
                  <div className="text-xl font-bold text-white mb-2">{bestResult ? bestResult.bank : 'N/A'}</div>
                  <div className="text-sm text-primary font-medium">Rate: {bestResult ? bestResult.rate.toFixed(4) : '--'} LKR</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Bank Comparison Results */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 overflow-hidden">
            <h3 className="text-base font-bold text-white mb-4">Bank Comparison ({fromCurrency} → {toCurrency})</h3>
            
            {loading ? (
              <div className="py-8 text-center text-slate-400">Loading live bank rates...</div>
            ) : (
              <div>
                {/* Desktop/Tablet Table view */}
                <div className="hidden sm:block overflow-x-auto">
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
                      {bankResults.map((result, index) => {
                        const isPreferred = userProfile?.preferredBank && result.bank === userProfile.preferredBank;
                        return (
                          <tr 
                            key={index} 
                            className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                              result.best 
                                ? 'bg-primary/5' 
                                : isPreferred 
                                  ? 'bg-yellow-500/5 border-yellow-500/20' 
                                  : ''
                            }`}
                          >
                            <td className={`py-4 text-white font-medium flex items-center gap-2 ${isPreferred ? 'text-yellow-400 font-bold' : ''}`}>
                              {result.best && <Trophy className="h-4 w-4 text-primary" />}
                              <span>{result.bank}</span>
                              {isPreferred && (
                                <span className="text-[9px] font-semibold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-1">
                                  ★ Preferred
                                </span>
                              )}
                            </td>
                            <td className={`py-4 text-right font-bold ${result.best ? 'text-primary' : isPreferred ? 'text-yellow-400' : 'text-white'}`}>{result.amount}</td>
                            <td className={`py-4 text-right text-sm ${isPreferred ? 'text-yellow-300' : 'text-slate-300'}`}>{result.rateDisplay}</td>
                            <td className="py-4 text-right">
                              <span className={`text-sm font-medium px-2 py-1 rounded ${
                                result.best 
                                  ? 'bg-primary/20 text-primary' 
                                  : isPreferred
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : result.diff.startsWith('+') 
                                      ? 'bg-accent/10 text-accent' 
                                      : 'bg-surface text-slate-400'
                              }`}>
                                {result.diff}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {bankResults.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-500">No bank data available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile list view */}
                <div className="flex flex-col gap-3 sm:hidden">
                  {bankResults.map((result, index) => {
                    const isPreferred = userProfile?.preferredBank && result.bank === userProfile.preferredBank;
                    return (
                      <div 
                        key={index} 
                        className={`p-4 rounded-xl border transition-all ${
                          result.best 
                            ? 'bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(0,240,255,0.05)]' 
                            : isPreferred
                              ? 'bg-yellow-500/[0.03] border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]'
                              : 'bg-[#111827]/40 border-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <img src={result.logo} alt={result.bank} className="w-6 h-6 rounded bg-white p-0.5" />
                            <span className={`font-bold text-sm ${isPreferred ? 'text-yellow-400' : 'text-white'}`}>{result.bank}</span>
                            {isPreferred && (
                              <span className="text-[9px] font-semibold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                ★ Preferred
                              </span>
                            )}
                          </div>
                          {result.best && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              <Trophy className="h-3 w-3" /> BEST
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="text-slate-400">Converted Amount</span>
                          <span className={`font-bold ${result.best ? 'text-primary' : isPreferred ? 'text-yellow-400' : 'text-white'}`}>{result.amount}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="text-slate-400">Exchange Rate</span>
                          <span className={`${isPreferred ? 'text-yellow-300' : 'text-slate-300'}`}>{result.rate.toFixed(2)} LKR</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Difference</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                            result.best 
                              ? 'bg-primary/20 text-primary' 
                              : isPreferred
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : result.diff.startsWith('+') 
                                  ? 'bg-accent/10 text-accent' 
                                  : 'bg-surface text-slate-500'
                          }`}>
                            {result.diff}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {bankResults.length === 0 && (
                    <div className="py-8 text-center text-slate-500">No bank data available.</div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* Section 5: Smart Recommendation */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[40px] rounded-full"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Recommendation</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-white">{bestResult ? bestResult.bank : 'N/A'}</strong> is highly recommended for this transaction.
              </div>
              <div className="bg-surface p-4 rounded-xl border border-white/5 text-sm text-slate-400 leading-relaxed">
                <strong>Reason:</strong> They currently provide the highest return for {fromCurrency} to {toCurrency} conversion. Rates have been stable at this level.
              </div>
              <button className="w-full bg-surface hover:bg-white/5 border border-white/10 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Set Alert for this Rate
              </button>
            </div>
          </div>

          {/* Section 4: Conversion History */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="h-4 w-4 text-primary" /> Recent Conversions
              </h3>
            </div>
            
            {!user ? (
              <div className="text-center py-8 px-4 bg-surface/30 rounded-xl border border-dashed border-white/10">
                <Lock className="h-6 w-6 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium mb-3">Save & track your conversions history</p>
                <Link to="/login" className="inline-block text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-[1.02] duration-200">
                  Log In to Unlock
                </Link>
              </div>
            ) : savedConversions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No saved conversions yet. Convert and save above!
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {savedConversions.map((item, i) => (
                  <div 
                    key={item.id || i} 
                    onClick={() => handleLoadSavedConversion(item)}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-transparent hover:border-primary/20 cursor-pointer transition-all hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-white font-medium text-xs md:text-sm">
                          {item.fromAmount.toLocaleString()} {item.fromCurrency} → {item.toCurrency}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> {new Date(item.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </div>
                    </div>
                    <button className="text-primary hover:text-primary-dark p-2 bg-primary/10 rounded-lg transition-colors">
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
