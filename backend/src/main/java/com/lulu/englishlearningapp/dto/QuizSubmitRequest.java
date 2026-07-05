package com.lulu.englishlearningapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuizSubmitRequest {

    private Long topicId;

    @Valid
    @NotEmpty(message = "Quiz answers are required")
    private List<QuizAnswerRequest> answers;
}
