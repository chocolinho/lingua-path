package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VocabularyRepository
        extends JpaRepository<Vocabulary, Long> {
    List<Vocabulary> findByTopicId(Long topicId);
    List<Vocabulary> findByWordContainingIgnoreCase(String keyword);
}