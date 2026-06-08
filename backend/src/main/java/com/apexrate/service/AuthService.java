package com.apexrate.service;

import com.apexrate.config.JwtUtil;
import com.apexrate.dto.AuthResponse;
import com.apexrate.dto.LoginRequest;
import com.apexrate.dto.RegisterRequest;
import com.apexrate.model.Role;
import com.apexrate.model.User;
import com.apexrate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        if (Period.between(request.getBirthDate(), LocalDate.now()).getYears() < 18) {
            throw new RuntimeException("Error: You must be at least 18 years old to register.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .nic(request.getNic())
                .birthDate(request.getBirthDate())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Error: Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getName(), user.getEmail());
    }
}
