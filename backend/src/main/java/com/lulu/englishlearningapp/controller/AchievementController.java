package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.AchievementResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;

    @GetMapping("/my")
    public List<AchievementResponse> getMyAchievements(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return achievementService.getMyAchievements(user);
    }
}
