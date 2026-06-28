package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AchievementResponse {

    private Long id;

    private String code;

    private String title;

    private String description;

    private String icon;

    private boolean unlocked;

    private LocalDateTime unlockedAt;
}
