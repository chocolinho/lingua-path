package com.lulu.englishlearningapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopicRequest {

    @NotBlank(message = "Topic name is required")
    private String name;

    private String description;
}
