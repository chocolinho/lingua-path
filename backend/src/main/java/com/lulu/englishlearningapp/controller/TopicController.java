package com.lulu.englishlearningapp.controller;

import com.lulu.englishlearningapp.dto.TopicRequest;
import com.lulu.englishlearningapp.dto.TopicResponse;
import com.lulu.englishlearningapp.service.TopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public List<TopicResponse> getAllTopics() {
        return topicService.getAllTopics();
    }

    @PostMapping
    public TopicResponse createTopic(@Valid @RequestBody TopicRequest request) {
        return topicService.createTopic(request);
    }

    @GetMapping("/{id}")
    public TopicResponse getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id);
    }

    @PutMapping("/{id}")
    public TopicResponse updateTopic(@PathVariable Long id, @Valid @RequestBody TopicRequest request) {
        return topicService.updateTopic(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
    }
}
