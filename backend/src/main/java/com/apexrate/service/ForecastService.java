package com.apexrate.service;

import com.apexrate.dto.HistoryPointDto;
import com.apexrate.dto.HistoryResponse;
import com.apexrate.model.Forecast;
import com.apexrate.repository.ForecastRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForecastService {

    private final RateService rateService;
    private final RestTemplate restTemplate;
    private final ForecastRepository forecastRepository;

    private static final String FORECAST_SERVICE_URL = "http://localhost:8000/predict";

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PythonForecastRequest {
        private List<Double> historical_rates;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PythonForecastResponse {
        private List<Double> forecast;
        private String method;
        private Integer lags_used;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForecastResultDto {
        private String dateLabel;
        private BigDecimal rate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForecastResponse {
        private String currencyPair;
        private String method;
        private List<ForecastResultDto> forecasts;
    }

    public ForecastResponse getOrRunForecast(String currencyPair) {
        // 1. Get 30 days of history to pass to python model
        HistoryResponse historyResponse = rateService.getHistoricalRates(currencyPair, "30D");
        List<Double> historicalRates = historyResponse.getPoints().stream()
                .map(HistoryPointDto::getRate)
                .map(BigDecimal::doubleValue)
                .collect(Collectors.toList());

        List<Double> predictedRates = new ArrayList<>();
        String method = "fallback_mock";

        try {
            // 2. Call the Python microservice
            PythonForecastRequest request = new PythonForecastRequest(historicalRates);
            PythonForecastResponse response = restTemplate.postForObject(FORECAST_SERVICE_URL, request, PythonForecastResponse.class);

            if (response != null && response.getForecast() != null) {
                predictedRates = response.getForecast();
                method = response.getMethod();
                log.info("Successfully received forecast from python microservice using method: {}", method);
            }
        } catch (Exception e) {
            log.error("Failed to call forecasting microservice, falling back to mock forecasting: {}", e.getMessage());
            // Fallback mock forecasting if Python service is down
            BigDecimal latestRate = historyResponse.getPoints().get(historyResponse.getPoints().size() - 1).getRate();
            double lastVal = latestRate.doubleValue();
            predictedRates.add(lastVal * 1.002);
            predictedRates.add(lastVal * 1.005);
            predictedRates.add(lastVal * 1.003);
        }

        // 3. Clear old forecasts and save new ones safely
        try {
            List<Forecast> existing = forecastRepository.findByCurrencyPairOrderByTargetDateAsc(currencyPair);
            forecastRepository.deleteAll(existing);
        } catch (Exception e) {
            log.error("Failed to delete existing forecasts from database: {}", e.getMessage());
        }

        // 4. Save new predictions & map to DTOs
        List<ForecastResultDto> results = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < predictedRates.size(); i++) {
            double rateVal = predictedRates.get(i);
            BigDecimal rateDec = BigDecimal.valueOf(rateVal).setScale(4, RoundingMode.HALF_UP);
            LocalDateTime targetDate = now.plusDays(i + 1);

            try {
                Forecast forecast = Forecast.builder()
                        .currencyPair(currencyPair)
                        .predictedRate(rateDec)
                        .targetDate(targetDate)
                        .build();
                forecastRepository.save(forecast);
            } catch (Exception e) {
                log.error("Failed to save forecast to database: {}", e.getMessage());
            }

            // Format date label (e.g. Day 1, Day 2, Day 3 or specific date representation)
            String label = "Day " + (i + 1);
            results.add(ForecastResultDto.builder()
                    .dateLabel(label)
                    .rate(rateDec)
                    .build());
        }

        return ForecastResponse.builder()
                .currencyPair(currencyPair)
                .method(method)
                .forecasts(results)
                .build();
    }
}
