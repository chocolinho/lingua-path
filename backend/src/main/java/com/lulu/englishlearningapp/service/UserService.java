package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.ChangePasswordRequest;
import com.lulu.englishlearningapp.dto.UpdateProfileRequest;
import com.lulu.englishlearningapp.dto.UserResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getCurrentUserResponse(User user) {
        int totalXp = user.getXp() == null ? 0 : user.getXp();
        int level = calculateLevel(totalXp);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .xp(totalXp)
                .level(level)
                .currentLevelXp(getCurrentLevelXp(level))
                .nextLevelXp(getNextLevelXp(level))
                .levelProgress(calculateLevelProgress(totalXp))
                .dailyStreak(user.getDailyStreak() == null ? 0 : user.getDailyStreak())
                .build();
    }

    public String changePassword(User user, ChangePasswordRequest request) {

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        return "Password changed successfully";
    }

    public UserResponse updateProfile(User user, UpdateProfileRequest request) {
        user.setUsername(request.getUsername().trim());
        return getCurrentUserResponse(userRepository.save(user));
    }

    public User addXp(User user, int xpAmount) {
        if (xpAmount <= 0) {
            return user;
        }

        if (user.getXp() == null) {
            user.setXp(0);
        }

        user.setXp(user.getXp() + xpAmount);
        return userRepository.save(user);
    }

    public User recordDailyLearning(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastLearningDate = user.getLastLearningDate();

        if (today.equals(lastLearningDate)) {
            return user;
        }

        int currentStreak = user.getDailyStreak() == null ? 0 : user.getDailyStreak();

        if (lastLearningDate != null && lastLearningDate.plusDays(1).equals(today)) {
            user.setDailyStreak(currentStreak + 1);
        } else {
            user.setDailyStreak(1);
        }

        user.setLastLearningDate(today);
        return userRepository.save(user);
    }

    public int calculateLevel(int xp) {
        if (xp >= 1000) return 5;
        if (xp >= 500) return 4;
        if (xp >= 250) return 3;
        if (xp >= 100) return 2;
        return 1;
    }

    public int getCurrentLevelXp(int level) {
        if (level >= 5) return 1000;
        if (level == 4) return 500;
        if (level == 3) return 250;
        if (level == 2) return 100;
        return 0;
    }

    public int getNextLevelXp(int level) {
        if (level == 1) return 100;
        if (level == 2) return 250;
        if (level == 3) return 500;
        if (level == 4) return 1000;
        return 1000;
    }

    public int calculateLevelProgress(int xp) {
        int level = calculateLevel(xp);

        if (level >= 5) {
            return 100;
        }

        int currentLevelXp = getCurrentLevelXp(level);
        int nextLevelXp = getNextLevelXp(level);

        return (int) (((xp - currentLevelXp) * 100.0) / (nextLevelXp - currentLevelXp));
    }
}
