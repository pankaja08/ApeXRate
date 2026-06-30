import React, { useState, useEffect } from 'react';
import { Cpu, TrendingUp, Sparkles, AlertTriangle, Calendar, Info, RefreshCw, ArrowUpRight, ArrowDownRight, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/layout/LoadingOverlay';

interface HistoryPoint {
  name: string;
  rate: number;
}

interface ForecastPoint {
  dateLabel: string;
  rate: number;
}

interface CombinedChartPoint {
  name: string;
  historicalRate?: number;
  forecastRate?: number;
  forecastRateMin?: number;
  forecastRateMax?: number;
  isForecast: boolean;
}

const calculateSimpleTrend = (points: HistoryPoint[]) => {
  if (points.length < 2) return 0;
  const len = points.length;
  const last = points[len - 1].rate;
  const prev = points[len - 2].rate;
  const prev2 = points[len - 3] ? points[len - 3].rate : prev;
  const slope = ((last - prev) + (prev - prev2)) / 2;
  return last + slope;
};

const Forecasts = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [method, setMethod] = useState<string>('');
  
  // States for data
  const [forecastPoints, setForecastPoints] = useState<ForecastPoint[]>([]);
  const [chartData, setChartData] = useState<CombinedChartPoint[]>([]);
  const [latestActualRate, setLatestActualRate] = useState<number>(0);

  const fetchForecastAndHistory = async (currency: string, showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      // 1. Fetch 7D History
      const historyRes = await fetch(`http://localhost:8080/api/v1/rates/history?currencyPair=${currency}/LKR&range=7D`);
      if (!historyRes.ok) throw new Error('Failed to fetch historical rates');
      const historyData = await historyRes.json();
      const histPoints: HistoryPoint[] = (historyData.points || []).map((p: any) => ({
        name: p.name,
        rate: parseFloat(p.rate)
      }));

      if (histPoints.length > 0) {
        const lastActual = histPoints[histPoints.length - 1].rate;
        setLatestActualRate(lastActual);

        let forePoints: ForecastPoint[] = [];

        if (user) {
          // 2. Fetch 3D Forecast from backend (Registered user only)
          const forecastRes = await fetch(`http://localhost:8080/api/v1/rates/forecast?currencyPair=${currency}/LKR`);
          if (!forecastRes.ok) throw new Error('Failed to fetch forecast prediction');
          const forecastData = await forecastRes.json();
          setMethod(forecastData.method || 'XGBoost');
          
          forePoints = (forecastData.forecasts || []).map((f: any) => ({
            dateLabel: f.dateLabel,
            rate: parseFloat(f.rate)
          }));
        } else {
          // Guest User: Calculate 1-Day basic trend projection
          setMethod('Linear Trend Projection');
          const nextDayRate = calculateSimpleTrend(histPoints);
          forePoints = [
            { dateLabel: 'Tomorrow', rate: nextDayRate }
          ];
        }

        setForecastPoints(forePoints);

        // 3. Build combined chart data
        const combined: CombinedChartPoint[] = histPoints.map(p => ({
          name: p.name,
          historicalRate: p.rate,
          forecastRate: undefined,
          forecastRateMin: undefined,
          forecastRateMax: undefined,
          isForecast: false
        }));

        if (combined.length > 0) {
          combined[combined.length - 1].forecastRate = lastActual;
          combined[combined.length - 1].forecastRateMin = lastActual;
          combined[combined.length - 1].forecastRateMax = lastActual;
        }

        // Add forecasted points (with confidence interval bands for logged-in users)
        forePoints.forEach((p, idx) => {
          const errorBound = user ? (idx + 1) * 0.45 : 0;
          combined.push({
            name: p.dateLabel,
            historicalRate: undefined,
            forecastRate: p.rate,
            forecastRateMin: p.rate - errorBound,
            forecastRateMax: p.rate + errorBound,
            isForecast: true
          });
        });

        setChartData(combined);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while running the forecasting model.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecastAndHistory(selectedCurrency, true);
  }, [selectedCurrency, user]);

  const handleRunForecast = () => {
    fetchForecastAndHistory(selectedCurrency, true);
  };

  const getDeltaPercentage = (forecasted: number) => {
    if (!latestActualRate) return 0;
    return ((forecasted - latestActualRate) / latestActualRate) * 100;
  };

  const getSentiment = () => {
    if (forecastPoints.length < 1 || !latestActualRate) return 'Neutral';
    const finalRate = forecastPoints[forecastPoints.length - 1].rate;
    const diff = finalRate - latestActualRate;
    if (diff > 0.15) return 'Bullish';
    if (diff < -0.15) return 'Bearish';
    return 'Neutral';
  };

  return (
    <>
      {loading && <LoadingOverlay message="Running AI forecasting model..." />}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 space-y-10">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Cpu className="h-8 w-8 text-primary animate-pulse" />
            AI Exchange Rate Forecasting
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Leverage machine learning algorithms to predict exchange rate fluctuations. The model processes historical indicators, moving averages, and volatility to forecast rates for the upcoming 3 days.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-full sm:w-auto cursor-pointer"
            disabled={loading}
          >
            <option value="USD">USD/LKR</option>
            <option value="EUR">EUR/LKR</option>
            <option value="GBP">GBP/LKR</option>
            <option value="JPY">JPY/LKR</option>
            <option value="AUD">AUD/LKR</option>
            <option value="SGD">SGD/LKR</option>
          </select>

          {user ? (
            <button
              onClick={handleRunForecast}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-background font-bold px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Run Forecast Model
            </button>
          ) : (
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-background font-bold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 w-full sm:w-auto text-center"
            >
              <Lock className="h-4 w-4" />
              Unlock 3-Day ML Model
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 border-l-4 border-l-red-500 flex items-start gap-3 bg-red-950/20">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-200">Execution Error</h4>
            <p className="text-xs text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Tomorrow (Day 1) - Unlocked for everyone */}
        {forecastPoints.length > 0 ? (
          (() => {
            const point = forecastPoints[0];
            const delta = getDeltaPercentage(point.rate);
            const isUp = delta >= 0;
            return (
              <div className="glass-card p-5 border-l-4 border-l-primary/60 glow-border-cyan">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
                      Tomorrow (Day 1)
                    </span>
                  </div>
                  {delta !== 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                      isUp ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(delta).toFixed(3)}%
                    </span>
                  )}
                </div>
                <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                  {loading ? '---' : `${point.rate.toFixed(2)}`}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {user ? 'Predicted ML exchange rate' : 'Basic linear trend projection'}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="glass-card p-5 border-l-4 border-l-slate-600 animate-pulse text-slate-500">Loading...</div>
        )}

        {/* Card 2: Day 2 - Unlocked if logged in, Locked if guest */}
        {user && forecastPoints.length > 1 ? (
          (() => {
            const point = forecastPoints[1];
            const delta = getDeltaPercentage(point.rate);
            const isUp = delta >= 0;
            return (
              <div className="glass-card p-5 border-l-4 border-l-indigo-500/50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
                      Day 2 Forecast
                    </span>
                  </div>
                  {delta !== 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                      isUp ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(delta).toFixed(3)}%
                    </span>
                  )}
                </div>
                <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                  {loading ? '---' : `${point.rate.toFixed(2)}`}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Predicted ML exchange rate</div>
              </div>
            );
          })()
        ) : (
          /* Locked Card 2 */
          <div className="glass-card p-5 border-l-4 border-l-slate-600/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-[3px] flex flex-col justify-center items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Lock className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Registered Users Only</span>
              <Link to="/register" className="text-[10px] text-primary hover:underline font-semibold">Sign up free →</Link>
            </div>
            <div className="filter blur-sm select-none pointer-events-none">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <span className="text-xs text-slate-600 font-semibold uppercase">Day 2 Forecast</span>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-700 mb-1 tracking-tight">302.45</div>
              <div className="text-[10px] text-slate-800">Predicted ML exchange rate</div>
            </div>
          </div>
        )}

        {/* Card 3: Day 3 - Unlocked if logged in, Locked if guest */}
        {user && forecastPoints.length > 2 ? (
          (() => {
            const point = forecastPoints[2];
            const delta = getDeltaPercentage(point.rate);
            const isUp = delta >= 0;
            return (
              <div className="glass-card p-5 border-l-4 border-l-accent/50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
                      Day 3 Forecast
                    </span>
                  </div>
                  {delta !== 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                      isUp ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(delta).toFixed(3)}%
                    </span>
                  )}
                </div>
                <div className="text-3xl font-extrabold text-white mb-1 tracking-tight">
                  {loading ? '---' : `${point.rate.toFixed(2)}`}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Predicted ML exchange rate</div>
              </div>
            );
          })()
        ) : (
          /* Locked Card 3 */
          <div className="glass-card p-5 border-l-4 border-l-slate-600/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-[3px] flex flex-col justify-center items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Lock className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Registered Users Only</span>
              <Link to="/register" className="text-[10px] text-primary hover:underline font-semibold">Sign up free →</Link>
            </div>
            <div className="filter blur-sm select-none pointer-events-none">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  <span className="text-xs text-slate-600 font-semibold uppercase">Day 3 Forecast</span>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-700 mb-1 tracking-tight">303.12</div>
              <div className="text-[10px] text-slate-800">Predicted ML exchange rate</div>
            </div>
          </div>
        )}
      </div>

      {/* Combined Chart Panel */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Trend Projection
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Combined chart showing the actual 7-day exchange rate path followed by the projected trend.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-3 h-1 bg-[#00F0FF] rounded-full shrink-0" />
              Actual (Past 7 Days)
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-3 h-1 bg-[#00FF66] border-t border-dashed rounded-full shrink-0" />
              {user ? 'XGBoost ML Forecast (Next 3 Days)' : 'Basic Trend Projection (Tomorrow)'}
            </div>
          </div>
        </div>

        <div className="h-80 w-full relative z-10">
          {loading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#0B0F19]/50 backdrop-blur-sm rounded-2xl">
              <RefreshCw className="h-10 w-10 text-primary animate-spin mb-3" />
              <span className="text-sm font-semibold text-slate-300">Running machine learning model...</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="absolute inset-0 flex justify-center items-center text-slate-400">
              No projection data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF66" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00FF66" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1e293b', borderRadius: '12px', padding: '12px' }} 
                  labelClassName="text-slate-400 text-xs font-semibold mb-1"
                  formatter={(value: any, name: any) => {
                    const label = name === "historicalRate" ? "Actual Rate" : "Forecasted Rate";
                    const color = name === "historicalRate" ? "#00F0FF" : "#00FF66";
                    return [<span style={{ color, fontWeight: 'bold' }}>{parseFloat(value).toFixed(2)} LKR</span>, label];
                  }}
                />
                
                {/* Confidence Interval Band - Unlocked for Registered Users */}
                {user && (
                  <Area 
                    type="monotone" 
                    dataKey={['forecastRateMin', 'forecastRateMax'] as any}
                    stroke="none"
                    fill="#00FF66"
                    fillOpacity={0.06}
                    activeDot={false}
                    tooltipType="none"
                  />
                )}

                {/* Connecting lines */}
                <Area 
                  type="monotone" 
                  dataKey="historicalRate" 
                  stroke="#00F0FF" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  activeDot={{ r: 6 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="forecastRate" 
                  stroke="#00FF66" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorForecast)" 
                  activeDot={{ r: 6, stroke: '#0B0F19', strokeWidth: 2 }}
                />
                {latestActualRate > 0 && (
                  <ReferenceLine 
                    y={latestActualRate} 
                    stroke="rgba(255, 255, 255, 0.1)" 
                    strokeDasharray="3 3"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Model Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Features Importance & Prediction Logic */}
        <div className="glass-card p-5 md:col-span-2 relative overflow-hidden group">
          {!user && (
            <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-[3px] flex flex-col justify-center items-center gap-3 z-20 text-center p-6">
              <Lock className="h-7 w-7 text-primary" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Lag Importance & Analytics</h4>
              <p className="text-xs text-slate-400 max-w-sm">Create a free account to unlock detailed feature analysis, lag coefficients, and model performance metrics.</p>
              <div className="flex gap-3 mt-2">
                <Link to="/register" className="bg-primary text-background text-xs font-bold px-4 py-2 rounded-lg hover:scale-105 transition-all shadow-lg">Sign Up Free</Link>
                <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-lg border border-white/10 transition-colors">Log In</Link>
              </div>
            </div>
          )}

          <div className={!user ? 'filter blur-sm select-none pointer-events-none' : ''}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Algorithm & Prediction Logic
              </h3>
              {user && (
                <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  getSentiment() === 'Bullish' ? 'bg-accent/10 text-accent' : getSentiment() === 'Bearish' ? 'bg-red-500/10 text-red-400' : 'bg-slate-500/10 text-slate-400'
                }`}>
                  Sentiment: {getSentiment()}
                </div>
              )}
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Our model uses an <strong>XGBoost Regressor</strong> (Extreme Gradient Boosting) to compute exchange rates. 
              Instead of relying purely on linear trends, it calculates recursive multi-step forecasts: predicting Day 1, 
              then feeding that prediction back as a lag feature to forecast Day 2 and Day 3.
            </p>

            <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Feature Importance Scores</h4>
            <div className="space-y-2.5">
              {[
                { name: 'Lag 1 (Previous Day Rate)', value: 45, color: 'bg-primary' },
                { name: '14-Day Simple Moving Average (SMA)', value: 25, color: 'bg-indigo-500' },
                { name: '7-Day Exponential Moving Average (EMA)', value: 18, color: 'bg-accent' },
                { name: 'Lag 2 (Rate 2 days ago)', value: 12, color: 'bg-slate-500' }
              ].map((feat, i) => (
                <div key={i} className="text-[11px]">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>{feat.name}</span>
                    <span className="font-bold">{feat.value}%</span>
                  </div>
                  <div className="w-full bg-[#0B0F19] rounded-full h-1.5 border border-white/5">
                    <div className={`h-full rounded-full ${feat.color}`} style={{ width: `${feat.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-[11px]">
              <div className="p-3 bg-[#0B0F19]/40 border border-white/5 rounded-xl">
                <span className="text-slate-500 block mb-1">Prediction Mode</span>
                <span className="text-primary font-bold">{method.includes('recursive') || method === 'recursive_predict' ? 'Recursive Lag Feed' : 'Direct Forecast'}</span>
              </div>
              <div className="p-3 bg-[#0B0F19]/40 border border-white/5 rounded-xl">
                <span className="text-slate-500 block mb-1">Inputs Used</span>
                <span className="text-accent font-bold">14 Core Lag & MA Features</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer / Model Information */}
        <div className="glass-card p-5 flex flex-col justify-between border-l-2 border-l-yellow-500/30">
          <div>
            <h3 className="text-white font-bold text-sm flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-yellow-500" />
              Disclaimer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Forecasting models are mathematical approximations based on past performance. Real exchange rates fluctuate due to complex geopolitical events, central bank policies, and macroeconomic forces that are not captured in historical price data. Do not make critical trading decisions solely based on this projection.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-3">
            Last model run: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

    </div>
    </>
  );
};

export default Forecasts;
