package com.apexrate.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ExchangeRateDto {
    private String bankName;
    private String currencyPair;
    private BigDecimal buyRate;
    private BigDecimal sellRate;
    private LocalDateTime timestamp;
}
