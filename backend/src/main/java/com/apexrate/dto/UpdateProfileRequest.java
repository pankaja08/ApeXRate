package com.apexrate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String contactNumber;

    @NotBlank
    private String nic;

    @NotNull
    private LocalDate birthDate;
}
