package com.apexrate.service;

import com.apexrate.dto.UpdateProfileRequest;
import com.apexrate.dto.UserProfileDto;
import com.apexrate.dto.UserPreferencesDTO;
import com.apexrate.model.User;
import com.apexrate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return UserProfileDto.builder()
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .contactNumber(user.getContactNumber())
                .nic(user.getNic())
                .birthDate(user.getBirthDate())
                .preferredBank(user.getPreferredBank())
                .preferredFiatCurrency(user.getPreferredFiatCurrency())
                .preferredDigitalCurrency(user.getPreferredDigitalCurrency())
                .build();
    }

    public UserProfileDto updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setContactNumber(request.getContactNumber());
        user.setNic(request.getNic());
        user.setBirthDate(request.getBirthDate());

        userRepository.save(user);

        return UserProfileDto.builder()
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .contactNumber(user.getContactNumber())
                .nic(user.getNic())
                .birthDate(user.getBirthDate())
                .preferredBank(user.getPreferredBank())
                .preferredFiatCurrency(user.getPreferredFiatCurrency())
                .preferredDigitalCurrency(user.getPreferredDigitalCurrency())
                .build();
    }

    public UserProfileDto updatePreferences(String username, UserPreferencesDTO request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPreferredBank(request.getPreferredBank());
        user.setPreferredFiatCurrency(request.getPreferredFiatCurrency());
        user.setPreferredDigitalCurrency(request.getPreferredDigitalCurrency());

        userRepository.save(user);
        return getUserProfile(username);
    }
}
