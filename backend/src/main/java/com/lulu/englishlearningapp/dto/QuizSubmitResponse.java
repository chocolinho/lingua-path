package com.lulu.englishlearningapp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmitResponse {

    private int totalQuestions;
    private int correctAnswers;
    private double score;

    private int earnedXp;
    private int totalXp;

    private int level;
    private int currentLevelXp;
    private int nextLevelXp;
    private int levelProgress;
}