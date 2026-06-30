package com.apexrate.controller;

import com.apexrate.dto.ConversionDto;
import com.apexrate.model.Conversion;
import com.apexrate.model.User;
import com.apexrate.repository.ConversionRepository;
import com.apexrate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/conversions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConversionController {

    private final ConversionRepository conversionRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ConversionDto> saveConversion(
            Authentication authentication,
            @RequestBody ConversionDto request) {
        
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversion conversion = Conversion.builder()
                .user(user)
                .fromCurrency(request.getFromCurrency())
                .toCurrency(request.getToCurrency())
                .fromAmount(request.getFromAmount())
                .toAmount(request.getToAmount())
                .recommendedBank(request.getRecommendedBank())
                .rate(request.getRate())
                .timestamp(LocalDateTime.now())
                .build();

        Conversion saved = conversionRepository.save(conversion);

        return ResponseEntity.ok(convertToDto(saved));
    }

    @GetMapping
    public ResponseEntity<List<ConversionDto>> getSavedConversions(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Conversion> conversions = conversionRepository.findByUserOrderByTimestampDesc(user);
        List<ConversionDto> dtos = conversions.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private ConversionDto convertToDto(Conversion c) {
        return ConversionDto.builder()
                .id(c.getId())
                .fromCurrency(c.getFromCurrency())
                .toCurrency(c.getToCurrency())
                .fromAmount(c.getFromAmount())
                .toAmount(c.getToAmount())
                .recommendedBank(c.getRecommendedBank())
                .rate(c.getRate())
                .timestamp(c.getTimestamp())
                .build();
    }
}
