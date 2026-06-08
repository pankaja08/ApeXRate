package com.apexrate.controller;

import com.apexrate.dto.UpdateProfileRequest;
import com.apexrate.dto.UserPreferencesDTO;
import com.apexrate.dto.UserProfileDto;
import com.apexrate.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            Authentication authentication, 
            @Valid @RequestBody UpdateProfileRequest request) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(username, request));
    }

    @PutMapping("/preferences")
    public ResponseEntity<UserProfileDto> updatePreferences(
            Authentication authentication, 
            @Valid @RequestBody UserPreferencesDTO request) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.updatePreferences(username, request));
    }
}
