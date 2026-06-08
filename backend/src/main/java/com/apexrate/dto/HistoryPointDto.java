package com.apexrate.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class HistoryPointDto {
    private String name;
    private BigDecimal rate;
}
