package com.apexrate.controller;

import com.apexrate.service.ForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ForecastController {

    private final ForecastService forecastService;

    @GetMapping("/forecast")
    public ResponseEntity<ForecastService.ForecastResponse> getForecast(
            @RequestParam(defaultValue = "USD/LKR") String currencyPair) {
        return ResponseEntity.ok(forecastService.getOrRunForecast(currencyPair));
    }
}
