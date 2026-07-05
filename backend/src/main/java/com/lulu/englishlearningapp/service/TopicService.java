package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.TopicRequest;
import com.lulu.englishlearningapp.dto.TopicResponse;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.TopicAccessType;
import com.lulu.englishlearningapp.entity.TopicApprovalStatus;
import com.lulu.englishlearningapp.entity.TopicVisibility;
import com.lulu.englishlearningapp.entity.User;
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
    private final SubscriptionService subscriptionService;

    public List<TopicResponse> getAllTopics(User user) {
        return topicRepository.findAll()
                .stream()
                .filter(topic -> subscriptionService.canViewTopicInLibrary(user, topic))
                .map(topic -> mapToResponse(topic, user))
                .toList();
    }

    public TopicResponse createTopic(TopicRequest request, User user) {
        subscriptionService.enforceCanCreateTopic(user);

        TopicVisibility visibility = request.getVisibility() == null
                ? TopicVisibility.PRIVATE
                : request.getVisibility();
        TopicApprovalStatus approvalStatus = resolveApprovalStatus(user, visibility, request.getApprovalStatus());

        Topic topic = Topic.builder()
                .name(request.getName().trim())
                .description(normalizeOptionalText(request.getDescription()))
                .owner(user)
                .visibility(visibility)
                .accessType(resolveAccessType(user, request.getAccessType(), TopicAccessType.FREE))
                .approvalStatus(approvalStatus)
                .build();

        return mapToResponse(topicRepository.save(topic), user);
    }

    public TopicResponse getTopicById(Long id, User user) {
        Topic topic = findTopicById(id);

        if (!subscriptionService.canViewTopicInLibrary(user, topic)) {
            subscriptionService.enforceTopicAccess(user, topic);
        }

        return mapToResponse(topic, user);
    }

    public Topic findTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    public TopicResponse updateTopic(Long id, TopicRequest request, User user) {
        Topic existingTopic = findTopicById(id);
        subscriptionService.enforceCanManageTopic(user, existingTopic);

        existingTopic.setName(request.getName().trim());
        existingTopic.setDescription(normalizeOptionalText(request.getDescription()));

        if (request.getVisibility() != null) {
            existingTopic.setVisibility(request.getVisibility());
            existingTopic.setApprovalStatus(resolveApprovalStatus(user, request.getVisibility(), request.getApprovalStatus()));
        }

        if (subscriptionService.isAdmin(user)) {
            if (request.getAccessType() != null) {
                existingTopic.setAccessType(request.getAccessType());
            }

            if (request.getApprovalStatus() != null) {
                existingTopic.setApprovalStatus(request.getApprovalStatus());
            }
        }

        return mapToResponse(topicRepository.save(existingTopic), user);
    }

    public void deleteTopic(Long id, User user) {
        Topic topic = findTopicById(id);
        subscriptionService.enforceCanManageTopic(user, topic);
        topicRepository.delete(topic);
    }

    private TopicResponse mapToResponse(Topic topic, User user) {
        User owner = topic.getOwner();
        boolean ownedByCurrentUser = subscriptionService.isTopicOwner(user, topic);

        return TopicResponse.builder()
                .id(topic.getId())
                .name(topic.getName())
                .description(topic.getDescription())
                .vocabularyCount(vocabularyRepository.countByTopicId(topic.getId()))
                .ownerId(owner == null ? null : owner.getId())
                .ownerUsername(owner == null ? null : owner.getUsername())
                .visibility(subscriptionService.getTopicVisibility(topic))
                .accessType(subscriptionService.getTopicAccessType(topic))
                .approvalStatus(subscriptionService.getTopicApprovalStatus(topic))
                .locked(!subscriptionService.canAccessTopic(user, topic))
                .ownedByCurrentUser(ownedByCurrentUser)
                .build();
    }

    private TopicAccessType resolveAccessType(
            User user,
            TopicAccessType requestedAccessType,
            TopicAccessType fallbackAccessType) {

        if (subscriptionService.isAdmin(user) && requestedAccessType != null) {
            return requestedAccessType;
        }

        return fallbackAccessType;
    }

    private TopicApprovalStatus resolveApprovalStatus(
            User user,
            TopicVisibility visibility,
            TopicApprovalStatus requestedApprovalStatus) {

        if (subscriptionService.isAdmin(user)) {
            return requestedApprovalStatus == null
                    ? TopicApprovalStatus.APPROVED
                    : requestedApprovalStatus;
        }

        if (visibility == TopicVisibility.PUBLIC) {
            return TopicApprovalStatus.PENDING;
        }

        return TopicApprovalStatus.APPROVED;
    }

    private String normalizeOptionalText(String value) {
        return value == null ? null : value.trim();
    }
}
