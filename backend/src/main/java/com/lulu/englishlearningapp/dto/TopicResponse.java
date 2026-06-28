package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TopicResponse {

    private Long id;

    private String name;

    private String description;

    private long vocabularyCount;
}
