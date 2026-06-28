package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.WrongAnswerResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.WrongAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wrong-answers")
@RequiredArgsConstructor
public class WrongAnswerController {

    private final WrongAnswerService wrongAnswerService;

    @GetMapping
    public List<WrongAnswerResponse> getMyWrongAnswers(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return wrongAnswerService.getMyWrongAnswers(user);
    }

    @PutMapping("/{id}/resolve")
    public void resolveWrongAnswer(
            Authentication authentication,
            @PathVariable Long id) {

        User user = (User) authentication.getPrincipal();
        wrongAnswerService.resolveWrongAnswer(id, user);
    }
}
