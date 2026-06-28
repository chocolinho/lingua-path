package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class WrongAnswerResponse {

    private Long id;

    private VocabularyResponse vocabulary;

    private String lastSubmittedAnswer;

    private int mistakeCount;

    private LocalDateTime lastMistakeAt;

    private boolean resolved;
}
