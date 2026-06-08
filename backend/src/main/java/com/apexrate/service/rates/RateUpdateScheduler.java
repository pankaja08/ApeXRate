package com.apexrate.service.rates;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.List;
import java.util.Comparator;
import com.apexrate.model.ExchangeRate;
import com.apexrate.model.User;
import com.apexrate.model.Notification;
import com.apexrate.repository.ExchangeRateRepository;
import com.apexrate.repository.BankRepository;
import com.apexrate.repository.UserRepository;
import com.apexrate.repository.NotificationRepository;

@Component
@RequiredArgsConstructor
public class RateUpdateScheduler {

    private final ExchangeRateApiService exchangeRateApiService;
    private final BankScraperService bankScraperService;
    private final ExchangeRateRepository exchangeRateRepository;
    private final BankRepository bankRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    // Run on startup, then every 6 hours
    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(fixedDelay = 21600000)
    public void updateRates() {
        System.out.println("Checking if rate update is needed...");

        Optional<ExchangeRate> latestRate = exchangeRateRepository.findTopByOrderByTimestampDesc();
        
        if (latestRate.isPresent()) {
            LocalDateTime lastUpdate = latestRate.get().getTimestamp();
            long hoursSinceLastUpdate = ChronoUnit.HOURS.between(lastUpdate, LocalDateTime.now());
            
            if (hoursSinceLastUpdate < 6 && bankRepository.count() >= 6) {
                System.out.println("Rates were updated " + hoursSinceLastUpdate + " hours ago and all banks are present. Skipping API and scraping requests to prevent rate limiting.");
                return; 
            }
        }

        System.out.println("Starting scheduled rate update (fetching from external sources)...");
        
        // 1. Fetch from Public API (Frankfurter)
        exchangeRateApiService.fetchRates();
        
        // Respectful delay between network calls
        sleep(5000);
        
        // 2. Scrape individual banks (Smart Simulation)
        bankScraperService.scrapeAllBanks();
        
        System.out.println("Scheduled rate update completed.");
        generateSmartAlerts();
    }

    private void generateSmartAlerts() {
        System.out.println("Generating smart alerts for users...");
        List<ExchangeRate> recentRates = exchangeRateRepository.findTop6ByCurrencyPairOrderByTimestampDesc("USD/LKR");
        if (recentRates.isEmpty()) return;

        // Find best buy and sell rates
        ExchangeRate bestBuy = recentRates.stream().filter(r -> r.getBuyRate() != null && !r.getBank().getName().equals("Global API")).max(Comparator.comparing(ExchangeRate::getBuyRate)).orElse(null);
        ExchangeRate bestSell = recentRates.stream().filter(r -> r.getSellRate() != null && !r.getBank().getName().equals("Global API")).min(Comparator.comparing(ExchangeRate::getSellRate)).orElse(null);

        List<User> users = userRepository.findAll();
        for (User user : users) {
            String preferredBank = user.getPreferredBank();
            if (preferredBank != null && !preferredBank.isEmpty()) {
                if (bestBuy != null && bestBuy.getBank().getName().equals(preferredBank)) {
                    createNotification(user, "Great news! Your preferred bank (" + preferredBank + ") currently offers the best buying exchange rate at " + bestBuy.getBuyRate() + " LKR!");
                }
                if (bestSell != null && bestSell.getBank().getName().equals(preferredBank)) {
                    createNotification(user, "Great news! Your preferred bank (" + preferredBank + ") currently offers the best selling exchange rate at " + bestSell.getSellRate() + " LKR!");
                }
            }
        }
    }

    private void createNotification(User user, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
