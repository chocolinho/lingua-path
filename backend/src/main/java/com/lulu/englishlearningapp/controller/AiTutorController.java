package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.AiTutorRequest;
import com.lulu.englishlearningapp.dto.AiTutorResponse;
import com.lulu.englishlearningapp.service.AiTutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiTutorController {

    private final AiTutorService aiTutorService;

    @PostMapping("/tutor")
    public AiTutorResponse askTutor(@Valid @RequestBody AiTutorRequest request) {
        return aiTutorService.askTutor(request);
    }
}
