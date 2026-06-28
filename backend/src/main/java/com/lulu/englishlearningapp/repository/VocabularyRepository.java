package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface VocabularyRepository
        extends JpaRepository<Vocabulary, Long> {

    List<Vocabulary> findByTopicId(Long topicId);

    long countByTopicId(Long topicId);

    List<Vocabulary> findByWordContainingIgnoreCase(String keyword);

    Page<Vocabulary> findByWordContainingIgnoreCaseOrMeaningContainingIgnoreCase(
            String word,
            String meaning,
            Pageable pageable
    );
}
