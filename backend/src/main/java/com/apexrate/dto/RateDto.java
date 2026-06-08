package com.apexrate.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class RateDto {
    private String bankName;
    private String bankLogo;
    private BigDecimal buyRate;
    private BigDecimal sellRate;
    private String lastUpdated;
}
