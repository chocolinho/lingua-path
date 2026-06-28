package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.FavoriteVocabulary;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteVocabularyRepository extends JpaRepository<FavoriteVocabulary, Long> {

    List<FavoriteVocabulary> findByUserOrderByCreatedAtDesc(User user);

    Optional<FavoriteVocabulary> findByUserAndVocabulary(User user, Vocabulary vocabulary);

    boolean existsByUserAndVocabulary(User user, Vocabulary vocabulary);

    void deleteByUserAndVocabulary(User user, Vocabulary vocabulary);
}
