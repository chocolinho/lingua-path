package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.RegisterRequest;
import com.lulu.englishlearningapp.dto.UserResponse;
import com.lulu.englishlearningapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.lulu.englishlearningapp.dto.LoginRequest;
import com.lulu.englishlearningapp.dto.AuthResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
