package com.apexrate.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class BankRateResponse {
    private String currencyPair;
    private List<RateDto> rates;
}
