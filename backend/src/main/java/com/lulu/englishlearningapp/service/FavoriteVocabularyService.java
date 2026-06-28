package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.FavoriteVocabularyResponse;
import com.lulu.englishlearningapp.dto.VocabularyResponse;
import com.lulu.englishlearningapp.entity.FavoriteVocabulary;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.Vocabulary;
import com.lulu.englishlearningapp.repository.FavoriteVocabularyRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteVocabularyService {

    private final FavoriteVocabularyRepository favoriteVocabularyRepository;
    private final VocabularyRepository vocabularyRepository;

    public List<FavoriteVocabularyResponse> getMyFavorites(User user) {
        return favoriteVocabularyRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public FavoriteVocabularyResponse addFavorite(User user, Long vocabularyId) {
        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new RuntimeException("Vocabulary not found"));

        return favoriteVocabularyRepository.findByUserAndVocabulary(user, vocabulary)
                .map(this::mapToResponse)
                .orElseGet(() -> mapToResponse(favoriteVocabularyRepository.save(
                        FavoriteVocabulary.builder()
                                .user(user)
                                .vocabulary(vocabulary)
                                .createdAt(LocalDateTime.now())
                                .build()
                )));
    }

    @Transactional
    public void removeFavorite(User user, Long vocabularyId) {
        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new RuntimeException("Vocabulary not found"));

        favoriteVocabularyRepository.deleteByUserAndVocabulary(user, vocabulary);
    }

    private FavoriteVocabularyResponse mapToResponse(FavoriteVocabulary favoriteVocabulary) {
        Vocabulary vocabulary = favoriteVocabulary.getVocabulary();

        return FavoriteVocabularyResponse.builder()
                .id(favoriteVocabulary.getId())
                .vocabulary(VocabularyResponse.builder()
                        .id(vocabulary.getId())
                        .word(vocabulary.getWord())
                        .meaning(vocabulary.getMeaning())
                        .exampleSentence(vocabulary.getExampleSentence())
                        .topicId(vocabulary.getTopic().getId())
                        .topicName(vocabulary.getTopic().getName())
                        .build())
                .createdAt(favoriteVocabulary.getCreatedAt())
                .build();
    }
}
