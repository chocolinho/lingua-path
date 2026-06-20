package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.VocabularyRequest;
import com.lulu.englishlearningapp.dto.VocabularyResponse;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.Vocabulary;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.lulu.englishlearningapp.repository.TopicRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
@Service
@RequiredArgsConstructor
public class VocabularyService {

    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;

    public List<VocabularyResponse> getAllVocabularies() {
        return vocabularyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public VocabularyResponse getVocabularyById(Long id) {
        Vocabulary vocabulary = vocabularyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vocabulary not found"));

        return mapToResponse(vocabulary);
    }

    public Vocabulary createVocabulary(Vocabulary vocabulary) {
        return vocabularyRepository.save(vocabulary);
    }

    public VocabularyResponse updateVocabulary(Long id, VocabularyRequest request) {
        Vocabulary existingVocabulary = vocabularyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vocabulary not found"));

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        existingVocabulary.setWord(request.getWord());
        existingVocabulary.setMeaning(request.getMeaning());
        existingVocabulary.setExampleSentence(request.getExampleSentence());
        existingVocabulary.setTopic(topic);

        Vocabulary updatedVocabulary = vocabularyRepository.save(existingVocabulary);

        return mapToResponse(updatedVocabulary);
    }

    public void deleteVocabulary(Long id) {
        vocabularyRepository.deleteById(id);
    }

    public VocabularyResponse createVocabulary(VocabularyRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Vocabulary vocabulary = Vocabulary.builder()
                .word(request.getWord())
                .meaning(request.getMeaning())
                .exampleSentence(request.getExampleSentence())
                .topic(topic)
                .build();

        Vocabulary savedVocabulary = vocabularyRepository.save(vocabulary);

        return mapToResponse(savedVocabulary);
    }

    private VocabularyResponse mapToResponse(Vocabulary vocabulary) {
        return VocabularyResponse.builder()
                .id(vocabulary.getId())
                .word(vocabulary.getWord())
                .meaning(vocabulary.getMeaning())
                .exampleSentence(vocabulary.getExampleSentence())
                .topicId(vocabulary.getTopic().getId())
                .topicName(vocabulary.getTopic().getName())
                .build();
    }
    public List<VocabularyResponse> getVocabulariesByTopicId(Long topicId) {
        return vocabularyRepository.findByTopicId(topicId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Page<VocabularyResponse> getVocabulariesWithPagination(
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);

        return vocabularyRepository.findAll(pageable)
                .map(this::mapToResponse);
    }
    public List<VocabularyResponse> searchVocabulary(String keyword) {

        return vocabularyRepository
                .findByWordContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}