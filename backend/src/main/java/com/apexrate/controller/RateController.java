package com.apexrate.controller;

import com.apexrate.dto.BankRateResponse;
import com.apexrate.dto.HistoryResponse;
import com.apexrate.service.RateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RateController {

    private final RateService rateService;

    @GetMapping("/latest")
    public ResponseEntity<BankRateResponse> getLatestRates(
            @RequestParam(defaultValue = "USD/LKR") String currencyPair) {
        return ResponseEntity.ok(rateService.getLatestRates(currencyPair));
    }

    @GetMapping("/history")
    public ResponseEntity<HistoryResponse> getHistoricalRates(
            @RequestParam(defaultValue = "USD/LKR") String currencyPair,
            @RequestParam(defaultValue = "7D") String range) {
        return ResponseEntity.ok(rateService.getHistoricalRates(currencyPair, range));
    }
}
