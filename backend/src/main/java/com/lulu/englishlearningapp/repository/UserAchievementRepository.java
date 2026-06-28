package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.Achievement;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {

    List<UserAchievement> findByUser(User user);

    Optional<UserAchievement> findByUserAndAchievement(User user, Achievement achievement);

    boolean existsByUserAndAchievement(User user, Achievement achievement);
}
