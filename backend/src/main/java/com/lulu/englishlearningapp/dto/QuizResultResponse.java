package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class QuizResultResponse {

    private Long id;

    private int totalQuestions;

    private int correctAnswers;

    private double score;

    private LocalDateTime submittedAt;

    private Long topicId;

    private String topicName;
}
