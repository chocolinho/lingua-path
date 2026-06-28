package com.lulu.englishlearningapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuizSubmitRequest {

    private Long topicId;

    private List<QuizAnswerRequest> answers;
}
