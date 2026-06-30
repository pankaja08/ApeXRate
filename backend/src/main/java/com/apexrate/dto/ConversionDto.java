package com.apexrate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversionDto {
    private Long id;
    private String fromCurrency;
    private String toCurrency;
    private Double fromAmount;
    private Double toAmount;
    private String recommendedBank;
    private Double rate;
    private LocalDateTime timestamp;
}
