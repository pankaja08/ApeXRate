package com.apexrate.service.rates;

import com.apexrate.model.Bank;
import com.apexrate.model.ExchangeRate;
import com.apexrate.repository.BankRepository;
import com.apexrate.repository.ExchangeRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExchangeRateApiService {

    private final RestTemplate restTemplate;
    private final ExchangeRateRepository exchangeRateRepository;
    private final BankRepository bankRepository;

    private static final String API_URL = "https://open.er-api.com/v6/latest/USD";

    public void fetchRates() {
        try {
            Map<String, Object> response = restTemplate.getForObject(API_URL, Map.class);
            if (response != null && response.containsKey("rates")) {
                Map<String, Number> rates = (Map<String, Number>) response.get("rates");
                
                Bank globalBank = getOrCreateGlobalBank();

                double lkrRate = rates.get("LKR").doubleValue();
                
                // Save USD/LKR
                saveRate(globalBank, "USD/LKR", lkrRate);
                
                // Save other currencies
                String[] currencies = {"EUR", "GBP", "JPY", "AUD", "SGD"};
                for (String curr : currencies) {
                    if (rates.containsKey(curr)) {
                        double crossRate = lkrRate / rates.get(curr).doubleValue();
                        saveRate(globalBank, curr + "/LKR", crossRate);
                    }
                }

                System.out.println("ExchangeRate-API rates updated successfully.");
            }
        } catch (Exception e) {
            System.err.println("Error fetching rates from ExchangeRate-API: " + e.getMessage());
        }
    }

    private Bank getOrCreateGlobalBank() {
        Optional<Bank> bankOpt = bankRepository.findByName("Global API");
        if (bankOpt.isPresent()) {
            Bank bank = bankOpt.get();
            String newLogo = "https://ui-avatars.com/api/?name=API&background=111827&color=00F0FF&size=128";
            if (!newLogo.equals(bank.getLogoUrl())) {
                bank.setLogoUrl(newLogo);
                return bankRepository.save(bank);
            }
            return bank;
        }
        Bank bank = Bank.builder()
                .name("Global API")
                .logoUrl("https://ui-avatars.com/api/?name=API&background=111827&color=00F0FF&size=128")
                .build();
        return bankRepository.save(bank);
    }

    private void saveRate(Bank bank, String currencyPair, Number rateValue) {
        if (rateValue != null) {
            BigDecimal rate = new BigDecimal(rateValue.toString());
            ExchangeRate exchangeRate = ExchangeRate.builder()
                    .bank(bank)
                    .currencyPair(currencyPair)
                    .buyRate(rate) // For global API, buy and sell are the same mid-market rate
                    .sellRate(rate)
                    .timestamp(LocalDateTime.now())
                    .build();
            exchangeRateRepository.save(exchangeRate);
        }
    }
}
