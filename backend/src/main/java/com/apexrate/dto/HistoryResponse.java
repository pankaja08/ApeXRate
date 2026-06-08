package com.apexrate.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class HistoryResponse {
    private String currencyPair;
    private String range;
    private BigDecimal highestRate;
    private BigDecimal lowestRate;
    private BigDecimal averageRate;
    private List<HistoryPointDto> points;
}
