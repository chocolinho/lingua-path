package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.QuizSubmitRequest;
import com.lulu.englishlearningapp.dto.QuizSubmitResponse;
import com.lulu.englishlearningapp.dto.QuizResultResponse;
import com.lulu.englishlearningapp.dto.VocabularyResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.UserRepository;
import com.lulu.englishlearningapp.service.QuizService;
import com.lulu.englishlearningapp.service.VocabularyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final UserRepository userRepository;
    private final VocabularyService vocabularyService;

    @PostMapping("/submit")
    public QuizSubmitResponse submitQuiz(
            @Valid @RequestBody QuizSubmitRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        return quizService.submitQuiz(request, user);
    }

    @GetMapping("/results")
    public List<QuizResultResponse> getQuizResults() {
        return quizService.getQuizResults();
    }

    @GetMapping("/my-results")
    public List<QuizResultResponse> getMyQuizResults(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return quizService.getMyQuizResults(user);
    }

    @GetMapping("/topic/{topicId}/questions")
    public List<VocabularyResponse> getQuizQuestionsByTopic(
            @PathVariable Long topicId,
            @RequestParam(required = false) Integer limit,
            Authentication authentication) {

        User user = getCurrentUser(authentication);
        return vocabularyService.getQuizQuestionsByTopic(topicId, user, limit);
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Authentication is null");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return user;
        }

        String email = authentication.getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
