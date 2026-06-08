package com.apexrate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String contactNumber;

    @NotBlank
    private String nic;

    @NotNull
    private LocalDate birthDate;

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
