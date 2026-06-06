# ApexRate 🚀
**Intelligent Sri Lankan Exchange Rate Comparison & Forecasting Platform**

A modern, high-performance financial dashboard designed to aggregate, compare, and analyze both fiat and digital currency exchange rates in real-time.

---

## 🌍 The Real World Problem
Sri Lankans, expatriates, and tourists face a deeply fragmented financial landscape when exchanging currencies. Every commercial bank in Sri Lanka offers different "Buy" and "Sell" margins, and these rates fluctuate daily. Manually checking 6+ different bank websites or physically visiting branches to find the best rate is tedious, time-consuming, and leads to financial losses for users making large remittances. Furthermore, there is no centralized, visually intuitive platform that tracks local historical data, forecasts future trends, and monitors live digital assets all in one place.

## 🎯 Target Audience
- **Freelancers & Expatriates**: Individuals receiving foreign income (USD, EUR, GBP) who want to maximize their LKR return on remittances.
- **Importers & Businesses**: Companies that need to buy foreign currency to pay international suppliers and require the lowest bank "Sell" rates.
- **Tourists & Travelers**: Visitors looking for the most competitive exchange rates upon arrival or departure.
- **Crypto Enthusiasts**: Users who want to track high-frequency digital asset prices (BTC, ETH, SOL) benchmarked against the LKR.

## 💡 How We Solve This
ApexRate acts as a centralized financial intelligence hub. We scrape and aggregate the latest fiat exchange rates from all major Sri Lankan commercial banks (Commercial Bank, Sampath, BOC, HNB, Seylan, Amana) and present them in an incredibly intuitive dashboard. Our platform automatically calculates the absolute "Best Buy" and "Best Sell" rates, allowing users to make split-second financial decisions. We also provide real-time, high-frequency trading data for digital assets directly via public crypto APIs.

## 🚀 The Impact
By providing absolute transparency into the currency market, ApexRate empowers Sri Lankans to save money on every transaction. It completely eliminates the information asymmetry between banks and consumers, saving users hours of manual research and directly increasing the value of their hard-earned remittances and investments.

## ⭐ How We Are Different from Other Platforms
Unlike static bank websites or basic global currency converters (like Google Finance or XE), ApexRate provides **hyper-localized** data specific to the physical banks available to Sri Lankan citizens. We don't just show the "Global Index" rate—we show the *actual* physical margins you will get when walking into a local branch. Combined with our ultra-modern glassmorphic UI, predictive forecasting, and per-second live crypto polling, ApexRate is a premium, all-in-one financial dashboard tailored for the Sri Lankan economy.

## 🛠️ Tech Stack
### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS (Custom Glassmorphism UI)
- **Data Visualization**: Recharts
- **Build Tool**: Vite
- **Icons**: Lucide React

### Backend
- **Framework**: Java 17, Spring Boot 3
- **Database**: JPA / Hibernate
- **Security**: Spring Security (JWT Authentication ready)
- **Task Scheduling**: Spring `@Scheduled` for automated data synchronization

### External API Integrations
- **ExchangeRate-API**: Global fiat baseline data
- **Binance Public API**: High-frequency (2-second polling) Live Crypto Markets
- **Clearbit Logo API**: Dynamic, high-quality bank and corporate branding

## ✨ Key Features
- **Live Local Fiat Aggregation**: Automatically fetches and compares exchange rates from 6 major Sri Lankan banks.
- **Smart Recommendations**: The algorithm instantly highlights the Best USD Buy and Best USD Sell rates across the country.
- **Intelligent Currency Converter**: Calculates your exact returns across all banks simultaneously, ranking them from best to worst.
- **Digital Assets Terminal**: A high-frequency sub-dashboard that polls live cryptocurrency prices (BTC, ETH, SOL, etc.) every 2 seconds and dynamically converts them to LKR.
- **Historical Analysis**: Interactive area charts to track currency fluctuations over time, helping users identify macro trends.
- **Premium UI/UX**: Cinematic background gradients, floating animations, glossy glass-panel cards, and seamless micro-interactions for an unparalleled user experience.
