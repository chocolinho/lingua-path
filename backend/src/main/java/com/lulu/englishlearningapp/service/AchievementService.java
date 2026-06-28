package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.AchievementResponse;
import com.lulu.englishlearningapp.entity.Achievement;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.UserAchievement;
import com.lulu.englishlearningapp.repository.AchievementRepository;
import com.lulu.englishlearningapp.repository.UserAchievementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public List<AchievementResponse> getMyAchievements(User user) {
        seedDefaultAchievements();

        Map<Long, UserAchievement> unlockedByAchievementId = userAchievementRepository.findByUser(user)
                .stream()
                .collect(Collectors.toMap(
                        userAchievement -> userAchievement.getAchievement().getId(),
                        Function.identity()
                ));

        return achievementRepository.findAll()
                .stream()
                .map(achievement -> mapToResponse(
                        achievement,
                        unlockedByAchievementId.get(achievement.getId())
                ))
                .toList();
    }

    public void evaluateAfterQuiz(User user, int totalXp, int level, int correctAnswers, int totalQuestions) {
        seedDefaultAchievements();

        unlock(user, "FIRST_QUIZ");

        if (totalXp >= 100) {
            unlock(user, "XP_100");
        }

        if (level >= 2) {
            unlock(user, "LEVEL_2");
        }

        if (totalQuestions > 0 && correctAnswers == totalQuestions) {
            unlock(user, "PERFECT_QUIZ");
        }

        int dailyStreak = user.getDailyStreak() == null ? 0 : user.getDailyStreak();
        if (dailyStreak >= 3) {
            unlock(user, "STREAK_3");
        }
    }

    public void unlock(User user, String code) {
        Achievement achievement = achievementRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Achievement not found: " + code));

        if (userAchievementRepository.existsByUserAndAchievement(user, achievement)) {
            return;
        }

        userAchievementRepository.save(UserAchievement.builder()
                .user(user)
                .achievement(achievement)
                .unlockedAt(LocalDateTime.now())
                .build());
    }

    private AchievementResponse mapToResponse(
            Achievement achievement,
            UserAchievement userAchievement) {

        return AchievementResponse.builder()
                .id(achievement.getId())
                .code(achievement.getCode())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .icon(achievement.getIcon())
                .unlocked(userAchievement != null)
                .unlockedAt(userAchievement == null ? null : userAchievement.getUnlockedAt())
                .build();
    }

    private void seedDefaultAchievements() {
        createIfMissing("FIRST_QUIZ", "First Quiz", "Complete your first quiz.", "Trophy");
        createIfMissing("XP_100", "100 XP Club", "Earn your first 100 XP.", "Star");
        createIfMissing("LEVEL_2", "Level Up", "Reach level 2.", "TrendingUp");
        createIfMissing("PERFECT_QUIZ", "Perfect Quiz", "Answer every quiz question correctly.", "BadgeCheck");
        createIfMissing("STREAK_3", "Three Day Streak", "Learn for three days in a row.", "Flame");
    }

    private void createIfMissing(String code, String title, String description, String icon) {
        if (achievementRepository.existsByCode(code)) {
            return;
        }

        achievementRepository.save(Achievement.builder()
                .code(code)
                .title(title)
                .description(description)
                .icon(icon)
                .build());
    }
}
