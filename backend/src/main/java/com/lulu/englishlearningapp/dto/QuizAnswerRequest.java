package com.lulu.englishlearningapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizAnswerRequest {

    @NotNull(message = "Vocabulary id is required")
    private Long vocabularyId;

    @NotBlank(message = "Answer is required")
    private String answer;
}
