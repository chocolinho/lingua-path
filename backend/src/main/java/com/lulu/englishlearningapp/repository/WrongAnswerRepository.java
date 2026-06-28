package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.Vocabulary;
import com.lulu.englishlearningapp.entity.WrongAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WrongAnswerRepository extends JpaRepository<WrongAnswer, Long> {

    List<WrongAnswer> findByUserAndResolvedFalseOrderByLastMistakeAtDesc(User user);

    Optional<WrongAnswer> findByUserAndVocabulary(User user, Vocabulary vocabulary);
}
