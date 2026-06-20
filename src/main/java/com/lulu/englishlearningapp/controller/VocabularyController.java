package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.entity.Vocabulary;
import jakarta.validation.Valid;
import com.lulu.englishlearningapp.service.VocabularyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import com.lulu.englishlearningapp.dto.VocabularyRequest;
import java.util.List;
import com.lulu.englishlearningapp.dto.VocabularyResponse;
@RestController
@RequestMapping("/api/vocabularies")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService vocabularyService;

    @GetMapping
    public List<VocabularyResponse> getAllVocabularies() {
        return vocabularyService.getAllVocabularies();
    }

    @GetMapping("/{id}")
    public VocabularyResponse getVocabularyById(@PathVariable Long id) {
        return vocabularyService.getVocabularyById(id);
    }
    @PostMapping
    public VocabularyResponse createVocabulary(@Valid @RequestBody VocabularyRequest request) {
        return vocabularyService.createVocabulary(request);
    }

    @PutMapping("/{id}")
    public VocabularyResponse updateVocabulary(
            @PathVariable Long id,
           @Valid @RequestBody VocabularyRequest request) {
        return vocabularyService.updateVocabulary(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteVocabulary(@PathVariable Long id) {
        vocabularyService.deleteVocabulary(id);
    }

    @GetMapping("/topic/{topicId}")
    public List<VocabularyResponse> getVocabulariesByTopicId(@PathVariable Long topicId) {
        return vocabularyService.getVocabulariesByTopicId(topicId);
    }
    @GetMapping("/page")
    public Page<VocabularyResponse> getVocabulariesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return vocabularyService.getVocabulariesWithPagination(page, size);
    }
    @GetMapping("/search")
    public List<VocabularyResponse> searchVocabulary(
            @RequestParam String keyword) {

        return vocabularyService.searchVocabulary(keyword);
    }
    }

