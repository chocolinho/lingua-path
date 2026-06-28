package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.TopicRequest;
import com.lulu.englishlearningapp.dto.TopicResponse;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;

    public List<TopicResponse> getAllTopics() {
        return topicRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TopicResponse createTopic(TopicRequest request) {
        Topic topic = Topic.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return mapToResponse(topicRepository.save(topic));
    }

    public TopicResponse getTopicById(Long id) {
        return mapToResponse(findTopicById(id));
    }

    public Topic findTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    public TopicResponse updateTopic(Long id, TopicRequest request) {
        Topic existingTopic = findTopicById(id);

        existingTopic.setName(request.getName());
        existingTopic.setDescription(request.getDescription());

        return mapToResponse(topicRepository.save(existingTopic));
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }

    private TopicResponse mapToResponse(Topic topic) {
        return TopicResponse.builder()
                .id(topic.getId())
                .name(topic.getName())
                .description(topic.getDescription())
                .vocabularyCount(vocabularyRepository.countByTopicId(topic.getId()))
                .build();
    }
}
