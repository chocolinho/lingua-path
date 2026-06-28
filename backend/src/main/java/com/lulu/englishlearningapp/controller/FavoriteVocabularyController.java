package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.FavoriteVocabularyResponse;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.service.FavoriteVocabularyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteVocabularyController {

    private final FavoriteVocabularyService favoriteVocabularyService;

    @GetMapping
    public List<FavoriteVocabularyResponse> getMyFavorites(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return favoriteVocabularyService.getMyFavorites(user);
    }

    @PostMapping("/vocabularies/{vocabularyId}")
    public FavoriteVocabularyResponse addFavorite(
            Authentication authentication,
            @PathVariable Long vocabularyId) {

        User user = (User) authentication.getPrincipal();
        return favoriteVocabularyService.addFavorite(user, vocabularyId);
    }

    @DeleteMapping("/vocabularies/{vocabularyId}")
    public void removeFavorite(
            Authentication authentication,
            @PathVariable Long vocabularyId) {

        User user = (User) authentication.getPrincipal();
        favoriteVocabularyService.removeFavorite(user, vocabularyId);
    }
}
