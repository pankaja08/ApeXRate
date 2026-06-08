package com.apexrate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private String name;
    private String username;
    private String email;
    private String contactNumber;
    private String nic;
    private LocalDate birthDate;
    private String preferredBank;
    private String preferredFiatCurrency;
    private String preferredDigitalCurrency;
}
