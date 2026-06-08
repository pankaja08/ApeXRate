package com.apexrate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPreferencesDTO {
    private String preferredBank;
    private String preferredFiatCurrency;
    private String preferredDigitalCurrency;
}
