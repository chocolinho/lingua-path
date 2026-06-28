package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.QuizAnswerRequest;
import com.lulu.englishlearningapp.dto.QuizResultResponse;
import com.lulu.englishlearningapp.dto.QuizSubmitRequest;
import com.lulu.englishlearningapp.dto.QuizSubmitResponse;
import com.lulu.englishlearningapp.entity.QuizResult;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.Vocabulary;
import com.lulu.englishlearningapp.repository.QuizResultRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizResultRepository quizResultRepository;
    private final VocabularyRepository vocabularyRepository;
    private final UserService userService;
    private final TopicService topicService;
    private final WrongAnswerService wrongAnswerService;
    private final AchievementService achievementService;

    public QuizSubmitResponse submitQuiz(
            QuizSubmitRequest request,
            User user) {

        List<QuizAnswerRequest> answers = request.getAnswers() == null
                ? Collections.emptyList()
                : request.getAnswers();
        int totalQuestions = answers.size();
        int correctAnswers = 0;
        Topic topic = request.getTopicId() == null ? null : topicService.findTopicById(request.getTopicId());

        for (QuizAnswerRequest answerRequest : answers) {
            Vocabulary vocabulary = vocabularyRepository.findById(answerRequest.getVocabularyId())
                    .orElseThrow(() -> new RuntimeException("Vocabulary not found"));

            if (topic != null && !vocabulary.getTopic().getId().equals(topic.getId())) {
                throw new RuntimeException("Vocabulary does not belong to selected topic");
            }

            if (vocabulary.getMeaning().equalsIgnoreCase(answerRequest.getAnswer().trim())) {
                correctAnswers++;
                wrongAnswerService.markResolved(user, vocabulary);
            } else {
                wrongAnswerService.recordWrongAnswer(user, vocabulary, answerRequest.getAnswer());
            }
        }

        double score = totalQuestions == 0 ? 0 : (correctAnswers * 100.0) / totalQuestions;

        QuizResult quizResult = new QuizResult();
        quizResult.setTotalQuestions(totalQuestions);
        quizResult.setCorrectAnswers(correctAnswers);
        quizResult.setScore(score);
        quizResult.setSubmittedAt(LocalDateTime.now());
        quizResult.setUser(user);
        quizResult.setTopic(topic);

        quizResultRepository.save(quizResult);

        int earnedXp = correctAnswers * 10;

        User updatedUser = userService.addXp(user, earnedXp);
        updatedUser = userService.recordDailyLearning(updatedUser);

        int totalXp = updatedUser.getXp() == null ? 0 : updatedUser.getXp();
        int level = userService.calculateLevel(totalXp);
        int currentLevelXp = userService.getCurrentLevelXp(level);
        int nextLevelXp = userService.getNextLevelXp(level);
        int levelProgress = userService.calculateLevelProgress(totalXp);

        achievementService.evaluateAfterQuiz(updatedUser, totalXp, level, correctAnswers, totalQuestions);

        return QuizSubmitResponse.builder()
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .score(score)
                .earnedXp(earnedXp)
                .totalXp(totalXp)
                .level(level)
                .currentLevelXp(currentLevelXp)
                .nextLevelXp(nextLevelXp)
                .levelProgress(levelProgress)
                .build();
    }

    public List<QuizResultResponse> getQuizResults() {
        return quizResultRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<QuizResultResponse> getMyQuizResults(User user) {
        return quizResultRepository.findByUserIdOrderBySubmittedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private QuizResultResponse mapToResponse(QuizResult quizResult) {
        Topic topic = quizResult.getTopic();

        return QuizResultResponse.builder()
                .id(quizResult.getId())
                .totalQuestions(quizResult.getTotalQuestions())
                .correctAnswers(quizResult.getCorrectAnswers())
                .score(quizResult.getScore())
                .submittedAt(quizResult.getSubmittedAt())
                .topicId(topic == null ? null : topic.getId())
                .topicName(topic == null ? null : topic.getName())
                .build();
    }
}
