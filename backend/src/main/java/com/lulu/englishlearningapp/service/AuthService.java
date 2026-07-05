package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.RegisterRequest;
import com.lulu.englishlearningapp.dto.UserResponse;
import com.lulu.englishlearningapp.entity.Role;
import com.lulu.englishlearningapp.entity.SubscriptionStatus;
import com.lulu.englishlearningapp.entity.SubscriptionType;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.lulu.englishlearningapp.dto.LoginRequest;
import com.lulu.englishlearningapp.dto.AuthResponse;
import com.lulu.englishlearningapp.security.JwtService;
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;
    private final SubscriptionService subscriptionService;

    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .subscriptionType(SubscriptionType.FREE)
                .subscriptionStatus(SubscriptionStatus.ACTIVE)
                .build();

        return userService.getCurrentUserResponse(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }
        Role role = user.getRole() == null ? Role.USER : user.getRole();
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .message("Login successful")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(role)
                .subscriptionType(subscriptionService.getSubscriptionType(user))
                .subscriptionStatus(subscriptionService.getSubscriptionStatus(user))
                .premiumUntil(user.getPremiumUntil())
                .premium(subscriptionService.isPremium(user))
                .token(token)
                .build();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
