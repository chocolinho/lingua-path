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
        return userService.getCurrentUserResponse(currentUser(authentication));
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        return userService.updateProfile(currentUser(authentication), request);
    }

    @PutMapping("/change-password")
    public String changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        return userService.changePassword(currentUser(authentication), request);
    }

    private User currentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }
}
