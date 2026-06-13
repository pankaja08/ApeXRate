package com.apexrate.service.rates;

import com.apexrate.model.Bank;
import com.apexrate.model.ExchangeRate;
import com.apexrate.repository.BankRepository;
import com.apexrate.repository.ExchangeRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BankScraperService {

    private final BankRepository bankRepository;
    private final ExchangeRateRepository exchangeRateRepository;

    public void scrapeAllBanks() {
        System.out.println("Initiating Smart Simulator for local bank rates...");
        
        String[] currencies = {"USD", "EUR", "GBP", "JPY", "AUD", "SGD"};
        
        for (String curr : currencies) {
            String pair = curr + "/LKR";
            List<ExchangeRate> latestRates = exchangeRateRepository.findLatestByCurrencyPair(pair);
            if (latestRates.isEmpty()) {
                System.err.println("No global base rate found for " + pair + ". Skipping simulated scraping.");
                continue;
            }
            
            ExchangeRate globalRate = latestRates.get(0);
            BigDecimal baseRate = globalRate.getBuyRate();
            
            System.out.println("Using Global Base Rate for " + pair + ": " + baseRate + " LKR");

            // Removed simulations, proceeding with real web scraping for all banks
        }
        
        // 3. Real Web Scraping
        scrapeAmanaBank();
        scrapeBocBank();
        scrapeSampathBank();
        scrapeSeylanBank();
        scrapeHnbBank();
        scrapeCommercialBank();
        
        System.out.println("All local bank rates have been successfully processed.");
    }

    private String mapCurrency(String text) {
        if (text == null) return null;
        String clean = text.toUpperCase().trim();
        if (clean.contains("USD") || clean.contains("US DOLLAR")) return "USD/LKR";
        if (clean.contains("EUR") || clean.contains("EURO")) return "EUR/LKR";
        if (clean.contains("GBP") || clean.contains("STERLING") || clean.contains("U.K. POUND") || clean.contains("POUNDS")) return "GBP/LKR";
        if (clean.contains("JPY") || clean.contains("JAPANESE YEN") || clean.contains("YEN")) return "JPY/LKR";
        // Check SAR/SAUDI before AUD — "SAUDI" contains the substring "AUD" which caused a false match
        if (clean.contains("SAUDI") || clean.contains("SAR")) return null;
        if (clean.contains("AUD") || clean.contains("AUSTRALIAN")) return "AUD/LKR";
        if (clean.contains("SGD") || clean.contains("SINGAPORE")) return "SGD/LKR";
        return null;
    }

    private void scrapeAmanaBank() {
        String bankName = "Amana Bank";
        String logoUrl = "https://www.google.com/s2/favicons?domain=amanabank.lk&sz=128";
        String url = "https://www.amanabank.lk/business/treasury/exchange-rates.html";
        try {
            System.out.println("Scraping " + bankName + "...");
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(15000)
                    .get();

            Elements tables = doc.select("table");
            for (Element table : tables) {
                Elements rows = table.select("tr");
                for (Element row : rows) {
                    Elements cols = row.select("td");
                    if (cols.size() >= 3) {
                        String rowCurrency = cols.get(0).text().trim();
                        String pair = mapCurrency(rowCurrency);
                        if (pair != null) {
                            String buyStr = cols.get(1).text().replaceAll("[^0-9.]", "");
                            String sellStr = cols.get(2).text().replaceAll("[^0-9.]", "");
                            if (!buyStr.isEmpty() && !sellStr.isEmpty()) {
                                try {
                                    BigDecimal buyRate = new BigDecimal(buyStr).setScale(4, RoundingMode.HALF_UP);
                                    BigDecimal sellRate = new BigDecimal(sellStr).setScale(4, RoundingMode.HALF_UP);
                                    Bank bank = getOrCreateBank(bankName, logoUrl);
                                    saveRate(bank, pair, buyRate, sellRate);
                                    System.out.println("Successfully scraped " + bankName + " (" + pair + "): Buy=" + buyRate + ", Sell=" + sellRate);
                                } catch (NumberFormatException e) {
                                    // ignore
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error scraping rates for " + bankName + ": " + e.getMessage());
        }
    }

    private void scrapeBocBank() {
        String bankName = "BOC";
        String logoUrl = "https://www.google.com/s2/favicons?domain=boc.lk&sz=128";
        String url = "https://boc.lk/rates-tariff";
        try {
            System.out.println("Scraping " + bankName + "...");
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(15000)
                    .get();

            Element table = doc.selectFirst("table.light-table");
            if (table == null) {
                System.err.println("BOC rates table 'table.light-table' not found!");
                return;
            }

            Elements rows = table.select("tbody tr");
            for (Element row : rows) {
                Elements cols = row.select("td");
                if (cols.size() >= 3) {
                    String rowCurrency = cols.get(0).text().trim();
                    String pair = mapCurrency(rowCurrency);
                    if (pair != null) {
                        String buyStr = "";
                        String sellStr = "";
                        // Preferred: TT rates (Col 5 and Col 6)
                        if (cols.size() >= 7) {
                            buyStr = cols.get(5).text().trim();
                            sellStr = cols.get(6).text().trim();
                        }
                        // Fallback to draft/notes (Col 1 and Col 2) if TT is not available or hyphenated
                        if (buyStr.isEmpty() || buyStr.equals("-") || sellStr.isEmpty() || sellStr.equals("-")) {
                            buyStr = cols.get(1).text().trim();
                            sellStr = cols.get(2).text().trim();
                        }
                        
                        buyStr = buyStr.replaceAll("[^0-9.]", "");
                        sellStr = sellStr.replaceAll("[^0-9.]", "");

                        if (!buyStr.isEmpty() && !sellStr.isEmpty()) {
                            try {
                                BigDecimal buyRate = new BigDecimal(buyStr).setScale(4, RoundingMode.HALF_UP);
                                BigDecimal sellRate = new BigDecimal(sellStr).setScale(4, RoundingMode.HALF_UP);
                                Bank bank = getOrCreateBank(bankName, logoUrl);
                                saveRate(bank, pair, buyRate, sellRate);
                                System.out.println("Successfully scraped " + bankName + " (" + pair + "): Buy=" + buyRate + ", Sell=" + sellRate);
                            } catch (NumberFormatException e) {
                                // ignore
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error scraping rates for " + bankName + ": " + e.getMessage());
        }
    }

    private void scrapeSampathBank() {
        String bankName = "Sampath Bank";
        String logoUrl = "https://www.google.com/s2/favicons?domain=sampath.lk&sz=128";
        String url = "https://www.sampath.lk/api/exchange-rates";
        try {
            System.out.println("Scraping " + bankName + " (via JSON API)...");
            String json = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(15000)
                    .ignoreContentType(true)
                    .execute()
                    .body();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(json);
            JsonNode dataArray = rootNode.get("data");
            if (dataArray != null && dataArray.isArray()) {
                for (JsonNode node : dataArray) {
                    JsonNode codeNode = node.get("CurrCode");
                    JsonNode buyNode = node.get("TTBUY");
                    JsonNode sellNode = node.get("TTSEL");
                    
                    if (codeNode != null && buyNode != null && sellNode != null) {
                        String pair = mapCurrency(codeNode.asText());
                        if (pair != null) {
                            String buyStr = buyNode.asText().replaceAll("[^0-9.]", "");
                            String sellStr = sellNode.asText().replaceAll("[^0-9.]", "");
                            
                            if (!buyStr.isEmpty() && !sellStr.isEmpty()) {
                                try {
                                    BigDecimal buyRate = new BigDecimal(buyStr).setScale(4, RoundingMode.HALF_UP);
                                    BigDecimal sellRate = new BigDecimal(sellStr).setScale(4, RoundingMode.HALF_UP);
                                    Bank bank = getOrCreateBank(bankName, logoUrl);
                                    saveRate(bank, pair, buyRate, sellRate);
                                    System.out.println("Successfully scraped " + bankName + " (" + pair + "): Buy=" + buyRate + ", Sell=" + sellRate);
                                } catch (NumberFormatException e) {
                                    // ignore
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error scraping rates for " + bankName + ": " + e.getMessage());
        }
    }

    private void scrapeSeylanBank() {
        String bankName = "Seylan Bank";
        String logoUrl = "https://www.google.com/s2/favicons?domain=seylan.lk&sz=128";
        String url = "https://www.seylan.lk/exchange-rates";
        try {
            System.out.println("Scraping " + bankName + "...");
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(15000)
                    .get();

            Elements tables = doc.select("table");
            for (Element table : tables) {
                Elements rows = table.select("tr");
                for (Element row : rows) {
                    Elements cols = row.select("td");
                    if (cols.size() >= 4) {
                        String rowCurrency = cols.get(1).text().trim();
                        String pair = mapCurrency(rowCurrency);
                        if (pair != null) {
                            String buyStr = cols.get(2).text().replaceAll("[^0-9.]", "");
                            String sellStr = cols.get(3).text().replaceAll("[^0-9.]", "");
                            if (!buyStr.isEmpty() && !sellStr.isEmpty()) {
                                try {
                                    BigDecimal buyRate = new BigDecimal(buyStr).setScale(4, RoundingMode.HALF_UP);
                                    BigDecimal sellRate = new BigDecimal(sellStr).setScale(4, RoundingMode.HALF_UP);
                                    Bank bank = getOrCreateBank(bankName, logoUrl);
                                    saveRate(bank, pair, buyRate, sellRate);
                                    System.out.println("Successfully scraped " + bankName + " (" + pair + "): Buy=" + buyRate + ", Sell=" + sellRate);
                                } catch (NumberFormatException e) {
                                    // ignore
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error scraping rates for " + bankName + ": " + e.getMessage());
        }
    }

    private void scrapeHnbBank() {
        String bankName = "HNB";
        String logoUrl = "/hnb_logo.png";
        String url = "https://venus.hnb.lk/api/get_exchange_rates_contents_web";
        try {
            System.out.println("Scraping " + bankName + " (via JSON API)...");
            String json = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(15000)
                    .ignoreContentType(true)
                    .execute()
                    .body();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(json);
            if (rootNode != null && rootNode.isArray()) {
                for (JsonNode node : rootNode) {
                    JsonNode codeNode = node.get("currencyCode");
                    JsonNode buyNode = node.get("buyingRate");
                    JsonNode sellNode = node.get("sellingRate");
                    
                    if (codeNode != null && buyNode != null && sellNode != null) {
                        String pair = mapCurrency(codeNode.asText());
                        if (pair != null) {
                            String buyStr = buyNode.asText().replaceAll("[^0-9.]", "");
                            String sellStr = sellNode.asText().replaceAll("[^0-9.]", "");
                            
                            if (!buyStr.isEmpty() && !sellStr.isEmpty()) {
                                try {
                                    BigDecimal buyRate = new BigDecimal(buyStr).setScale(4, RoundingMode.HALF_UP);
                                    BigDecimal sellRate = new BigDecimal(sellStr).setScale(4, RoundingMode.HALF_UP);
                                    Bank bank = getOrCreateBank(bankName, logoUrl);
                                    saveRate(bank, pair, buyRate, sellRate);
                                    System.out.println("Successfully scraped " + bankName + " (" + pair + "): Buy=" + buyRate + ", Sell=" + sellRate);
                                } catch (NumberFormatException e) {
                                    // ignore
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error scraping rates for " + bankName + ": " + e.getMessage());
        }
    }

    private void scrapeCommercialBank() {
        String bankName = "Commercial Bank";
        String logoUrl = "/combank_logo.png";
        String url = "https://www.combank.lk/rates-tariff";
        try {
            System.out.println("Scraping " + bankName + "...");
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(15000)
                    .get();

            Element table = doc.selectFirst("table.with-border");
            if (table == null) {
                System.err.println("Commercial Bank rates table 'table.with-border' not found!");
                return;
            }

            Elements rows = table.select("tr");
            for (Element row : rows) {
                Elements cols = row.select("td");
                if (cols.size() >= 3) {
                    String rowCurrency = cols.get(0).text().trim();
                    String pair = mapCurrency(rowCurrency);
                    if (pair != null) {
                        String buyStr = cols.get(1).text().replaceAll("[^0-9.]", "");
                        String sellStr = cols.get(2).text().replaceAll("[^0-9.]", "");

                        if (!buyStr.isEmpty() && !sellStr.isEmpty()) {
                            try {
                                BigDecimal buyRate = new BigDecimal(buyStr).setScale(4, RoundingMode.HALF_UP);
                                BigDecimal sellRate = new BigDecimal(sellStr).setScale(4, RoundingMode.HALF_UP);
                                Bank bank = getOrCreateBank(bankName, logoUrl);
                                saveRate(bank, pair, buyRate, sellRate);
                                System.out.println("Successfully scraped " + bankName + " (" + pair + "): Buy=" + buyRate + ", Sell=" + sellRate);
                            } catch (NumberFormatException e) {
                                // ignore
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error scraping rates for " + bankName + ": " + e.getMessage());
        }
    }

    private void simulateBankRates(String bankName, String logoUrl, String currencyPair, BigDecimal baseRate, double buyMarginPct, double sellMarginPct) {
        try {
            Bank bank = getOrCreateBank(bankName, logoUrl);

            // Add a tiny random fluctuation (-0.2% to +0.2%) to make it look alive
            double randomFluctuation = (Math.random() * 0.4) - 0.2;
            
            // Calculate Buy Rate: base rate + buy margin percentage + random fluctuation
            BigDecimal buyRate = baseRate.multiply(BigDecimal.valueOf(1 + (buyMarginPct + randomFluctuation) / 100))
                                         .setScale(4, RoundingMode.HALF_UP);
                                         
            // Calculate Sell Rate: base rate + sell margin percentage + random fluctuation
            BigDecimal sellRate = baseRate.multiply(BigDecimal.valueOf(1 + (sellMarginPct + randomFluctuation) / 100))
                                          .setScale(4, RoundingMode.HALF_UP);

            saveRate(bank, currencyPair, buyRate, sellRate);
            
        } catch (Exception e) {
            System.err.println("Error simulating rates for " + bankName + ": " + e.getMessage());
        }
    }

    private Bank getOrCreateBank(String name, String logoUrl) {
        Optional<Bank> bankOpt = bankRepository.findByName(name);
        if (bankOpt.isPresent()) {
            Bank bank = bankOpt.get();
            if (!logoUrl.equals(bank.getLogoUrl())) {
                bank.setLogoUrl(logoUrl);
                return bankRepository.save(bank);
            }
            return bank;
        }
        Bank bank = Bank.builder()
                .name(name)
                .logoUrl(logoUrl)
                .build();
        return bankRepository.save(bank);
    }

    private void saveRate(Bank bank, String currencyPair, BigDecimal buy, BigDecimal sell) {
        ExchangeRate exchangeRate = ExchangeRate.builder()
                .bank(bank)
                .currencyPair(currencyPair)
                .buyRate(buy)
                .sellRate(sell)
                .timestamp(LocalDateTime.now())
                .build();
        exchangeRateRepository.save(exchangeRate);
    }
}
