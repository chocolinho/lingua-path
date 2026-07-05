package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.VocabularyRequest;
import com.lulu.englishlearningapp.dto.VocabularyResponse;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.entity.Vocabulary;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class VocabularyService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id",
            "word",
            "meaning",
            "exampleSentence"
    );

    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final SubscriptionService subscriptionService;

    public List<VocabularyResponse> getAllVocabularies(User user) {
        return vocabularyRepository.findAll()
                .stream()
                .filter(vocabulary -> subscriptionService.canAccessTopic(user, vocabulary.getTopic()))
                .map(this::mapToResponse)
                .toList();
    }

    public VocabularyResponse getVocabularyById(Long id, User user) {
        Vocabulary vocabulary = findVocabularyById(id);
        subscriptionService.enforceTopicAccess(user, vocabulary.getTopic());
        return mapToResponse(vocabulary);
    }

    public VocabularyResponse createVocabulary(VocabularyRequest request, User user) {
        Topic topic = findTopicById(request.getTopicId());

        subscriptionService.enforceCanManageTopic(user, topic);
        subscriptionService.enforceCanCreateVocabulary(user);

        Vocabulary vocabulary = Vocabulary.builder()
                .word(request.getWord().trim())
                .meaning(request.getMeaning().trim())
                .exampleSentence(normalizeOptionalText(request.getExampleSentence()))
                .topic(topic)
                .build();

        return mapToResponse(vocabularyRepository.save(vocabulary));
    }

    public VocabularyResponse updateVocabulary(Long id, VocabularyRequest request, User user) {
        Vocabulary existingVocabulary = findVocabularyById(id);
        Topic topic = findTopicById(request.getTopicId());

        subscriptionService.enforceCanManageTopic(user, existingVocabulary.getTopic());
        subscriptionService.enforceCanManageTopic(user, topic);

        existingVocabulary.setWord(request.getWord().trim());
        existingVocabulary.setMeaning(request.getMeaning().trim());
        existingVocabulary.setExampleSentence(normalizeOptionalText(request.getExampleSentence()));
        existingVocabulary.setTopic(topic);

        return mapToResponse(vocabularyRepository.save(existingVocabulary));
    }

    public void deleteVocabulary(Long id, User user) {
        Vocabulary vocabulary = findVocabularyById(id);
        subscriptionService.enforceCanManageTopic(user, vocabulary.getTopic());
        vocabularyRepository.delete(vocabulary);
    }

    public List<VocabularyResponse> getVocabulariesByTopicId(Long topicId, User user) {
        Topic topic = findTopicById(topicId);
        subscriptionService.enforceTopicAccess(user, topic);

        return vocabularyRepository.findByTopicId(topicId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<VocabularyResponse> getQuizQuestionsByTopic(Long topicId, User user, Integer limit) {
        Topic topic = findTopicById(topicId);
        subscriptionService.enforceTopicAccess(user, topic);

        int questionLimit = resolveQuizQuestionLimit(user, limit);

        return vocabularyRepository.findByTopicId(topicId)
                .stream()
                .limit(questionLimit)
                .map(this::mapToResponse)
                .toList();
    }

    public List<VocabularyResponse> searchVocabulary(String keyword, User user) {
        return vocabularyRepository
                .findByWordContainingIgnoreCase(keyword.trim())
                .stream()
                .filter(vocabulary -> subscriptionService.canAccessTopic(user, vocabulary.getTopic()))
                .map(this::mapToResponse)
                .toList();
    }

    public Page<VocabularyResponse> getVocabulariesWithPagination(
            int page,
            int size,
            String sortField,
            User user) {

        String safeSortField = resolveSortField(sortField);
        Pageable pageable = PageRequest.of(page, size, Sort.by(safeSortField));
        List<VocabularyResponse> accessibleVocabularies = vocabularyRepository.findAll(Sort.by(safeSortField))
                .stream()
                .filter(vocabulary -> subscriptionService.canAccessTopic(user, vocabulary.getTopic()))
                .map(this::mapToResponse)
                .toList();

        return toPage(accessibleVocabularies, pageable);
    }

    public Page<VocabularyResponse> searchVocabularyWithPagination(
            String keyword,
            int page,
            int size,
            String sortField,
            User user) {

        String safeSortField = resolveSortField(sortField);
        String normalizedKeyword = keyword == null ? "" : keyword.trim();
        Pageable pageable = PageRequest.of(page, size, Sort.by(safeSortField));
        List<VocabularyResponse> accessibleVocabularies = vocabularyRepository
                .findByWordContainingIgnoreCaseOrMeaningContainingIgnoreCase(
                        normalizedKeyword,
                        normalizedKeyword,
                        pageable
                )
                .stream()
                .filter(vocabulary -> subscriptionService.canAccessTopic(user, vocabulary.getTopic()))
                .map(this::mapToResponse)
                .toList();

        return new PageImpl<>(accessibleVocabularies, pageable, accessibleVocabularies.size());
    }

    private Vocabulary findVocabularyById(Long id) {
        return vocabularyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vocabulary not found"));
    }

    private Topic findTopicById(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    private int resolveQuizQuestionLimit(User user, Integer requestedLimit) {
        if (requestedLimit != null) {
            if (requestedLimit < 1) {
                throw new RuntimeException("Quiz question limit must be at least 1");
            }

            subscriptionService.enforceQuizQuestionLimit(user, requestedLimit);
            return requestedLimit;
        }

        if (subscriptionService.hasPremiumPrivileges(user)) {
            return Integer.MAX_VALUE;
        }

        return SubscriptionService.FREE_MAX_QUIZ_QUESTIONS;
    }

    private Page<VocabularyResponse> toPage(List<VocabularyResponse> vocabularies, Pageable pageable) {
        int start = (int) pageable.getOffset();

        if (start >= vocabularies.size()) {
            return new PageImpl<>(List.of(), pageable, vocabularies.size());
        }

        int end = Math.min(start + pageable.getPageSize(), vocabularies.size());
        return new PageImpl<>(vocabularies.subList(start, end), pageable, vocabularies.size());
    }

    private String resolveSortField(String sortField) {
        if (sortField == null || sortField.isBlank()) {
            return "id";
        }

        String normalizedSortField = sortField.trim();

        if (!ALLOWED_SORT_FIELDS.contains(normalizedSortField)) {
            throw new RuntimeException("Invalid sort field");
        }

        return normalizedSortField;
    }

    private String normalizeOptionalText(String value) {
        return value == null ? null : value.trim();
    }

    private VocabularyResponse mapToResponse(Vocabulary vocabulary) {
        Topic topic = vocabulary.getTopic();

        return VocabularyResponse.builder()
                .id(vocabulary.getId())
                .word(vocabulary.getWord())
                .meaning(vocabulary.getMeaning())
                .exampleSentence(vocabulary.getExampleSentence())
                .topicId(topic == null ? null : topic.getId())
                .topicName(topic == null ? null : topic.getName())
                .build();
    }
}
