package com.apexrate.service;

import com.apexrate.dto.ExchangeRateDto;
import com.apexrate.model.ExchangeRate;
import com.apexrate.repository.ExchangeRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExchangeRateService {

    private final ExchangeRateRepository exchangeRateRepository;

    public List<ExchangeRateDto> getLatestRates(String currencyPair) {
        List<ExchangeRate> rates = exchangeRateRepository.findLatestByCurrencyPair(currencyPair);
        
        return rates.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ExchangeRateDto mapToDto(ExchangeRate rate) {
        return ExchangeRateDto.builder()
                .bankName(rate.getBank().getName())
                .currencyPair(rate.getCurrencyPair())
                .buyRate(rate.getBuyRate())
                .sellRate(rate.getSellRate())
                .timestamp(rate.getTimestamp())
                .build();
    }
}
