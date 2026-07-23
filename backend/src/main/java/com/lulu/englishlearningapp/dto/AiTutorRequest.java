package com.lulu.englishlearningapp.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiTutorRequest {

    @Size(max = 500, message = "Message must be 500 characters or less")
    private String message;

    private String level;

    private String topic;
}
