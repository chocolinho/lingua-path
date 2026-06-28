package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class FavoriteVocabularyResponse {

    private Long id;

    private VocabularyResponse vocabulary;

    private LocalDateTime createdAt;
}
