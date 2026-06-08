package com.apexrate.controller;

import com.apexrate.dto.ExchangeRateDto;
import com.apexrate.service.ExchangeRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/rates")
@RequiredArgsConstructor
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    @GetMapping("/{currencyPair}")
    public ResponseEntity<List<ExchangeRateDto>> getLatestRates(
            @PathVariable String currencyPair) {
        
        // Example currencyPair: "USD-LKR"
        String formattedPair = currencyPair.replace("-", "/").toUpperCase();
        List<ExchangeRateDto> rates = exchangeRateService.getLatestRates(formattedPair);
        
        return ResponseEntity.ok(rates);
    }
}
