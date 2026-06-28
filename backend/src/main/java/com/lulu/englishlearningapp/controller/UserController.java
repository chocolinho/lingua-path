package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.ChangePasswordRequest;
import com.lulu.englishlearningapp.dto.UpdateProfileRequest;
import com.lulu.englishlearningapp.dto.UserResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return userService.getCurrentUserResponse(user);
    }

    @PutMapping("/me")
    public UserResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        User user = (User) authentication.getPrincipal();
        return userService.updateProfile(user, request);
    }

    @PutMapping("/change-password")
    public String changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        User user = (User) authentication.getPrincipal();

        return userService.changePassword(user, request);
    }
}
