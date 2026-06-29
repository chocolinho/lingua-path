package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.AdminTopTopicResponse;
import com.lulu.englishlearningapp.dto.AdminTopUserResponse;
import com.lulu.englishlearningapp.dto.AdminStatsResponse;
import com.lulu.englishlearningapp.dto.PaymentResponse;
import com.lulu.englishlearningapp.dto.TopicResponse;
import com.lulu.englishlearningapp.entity.PaymentStatus;
import com.lulu.englishlearningapp.entity.PaymentTransaction;
import com.lulu.englishlearningapp.entity.Role;
import com.lulu.englishlearningapp.entity.SubscriptionPlanType;
import com.lulu.englishlearningapp.entity.SubscriptionType;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.TopicAccessType;
import com.lulu.englishlearningapp.entity.TopicApprovalStatus;
import com.lulu.englishlearningapp.entity.TopicVisibility;
import com.lulu.englishlearningapp.entity.User;
import com.lulu.englishlearningapp.repository.PaymentTransactionRepository;
import com.lulu.englishlearningapp.repository.QuizResultRepository;
import com.lulu.englishlearningapp.repository.TopicRepository;
import com.lulu.englishlearningapp.repository.UserRepository;
import com.lulu.englishlearningapp.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final VocabularyRepository vocabularyRepository;
    private final QuizResultRepository quizResultRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final SubscriptionService subscriptionService;
    private final UserService userService;

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long premiumUsers = userRepository.countBySubscriptionType(SubscriptionType.PREMIUM);
        long totalTopics = topicRepository.count();
        long premiumTopics = topicRepository.countByAccessType(TopicAccessType.PREMIUM);

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .freeUsers(totalUsers - premiumUsers)
                .premiumUsers(premiumUsers)
                .adminUsers(userRepository.countByRole(Role.ADMIN))
                .totalTopics(totalTopics)
                .freeTopics(totalTopics - premiumTopics)
                .premiumTopics(premiumTopics)
                .publicTopics(topicRepository.countByVisibility(TopicVisibility.PUBLIC))
                .pendingTopics(topicRepository.countByApprovalStatus(TopicApprovalStatus.PENDING))
                .totalVocabularies(vocabularyRepository.count())
                .quizAttempts(quizResultRepository.count())
                .totalPayments(paymentTransactionRepository.count())
                .successfulPayments(paymentTransactionRepository.countByStatus(PaymentStatus.SUCCESS))
                .monthlySubscriptions(paymentTransactionRepository.countByPlanType(SubscriptionPlanType.MONTHLY))
                .yearlySubscriptions(paymentTransactionRepository.countByPlanType(SubscriptionPlanType.YEARLY))
                .recentPayments(getRecentPayments())
                .topUsersByXp(getTopUsersByXp())
                .topTopicsByVocabularyCount(getTopTopicsByVocabularyCount())
                .build();
    }

    public List<TopicResponse> getTopics(User admin) {
        return topicRepository.findAll()
                .stream()
                .map(topic -> mapTopicToResponse(topic, admin))
                .toList();
    }

    public TopicResponse updateTopicAccessType(Long topicId, TopicAccessType accessType, User admin) {
        Topic topic = findTopicById(topicId);
        topic.setAccessType(accessType);
        return mapTopicToResponse(topicRepository.save(topic), admin);
    }

    public TopicResponse approveTopic(Long topicId, User admin) {
        Topic topic = findTopicById(topicId);
        topic.setApprovalStatus(TopicApprovalStatus.APPROVED);
        return mapTopicToResponse(topicRepository.save(topic), admin);
    }

    public TopicResponse rejectTopic(Long topicId, User admin) {
        Topic topic = findTopicById(topicId);
        topic.setApprovalStatus(TopicApprovalStatus.REJECTED);
        return mapTopicToResponse(topicRepository.save(topic), admin);
    }

    private Topic findTopicById(Long topicId) {
        return topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    private TopicResponse mapTopicToResponse(Topic topic, User admin) {
        User owner = topic.getOwner();

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
                .locked(!subscriptionService.canAccessTopic(admin, topic))
                .ownedByCurrentUser(subscriptionService.isTopicOwner(admin, topic))
                .build();
    }

    private List<PaymentResponse> getRecentPayments() {
        return paymentTransactionRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapPaymentToResponse)
                .toList();
    }

    private List<AdminTopUserResponse> getTopUsersByXp() {
        return userRepository.findByOrderByXpDesc(PageRequest.of(0, 5))
                .stream()
                .map(user -> AdminTopUserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .xp(user.getXp())
                        .level(userService.calculateLevel(user.getXp() == null ? 0 : user.getXp()))
                        .subscriptionType(user.getSubscriptionType())
                        .build())
                .toList();
    }

    private List<AdminTopTopicResponse> getTopTopicsByVocabularyCount() {
        return topicRepository.findAll()
                .stream()
                .map(topic -> AdminTopTopicResponse.builder()
                        .id(topic.getId())
                        .name(topic.getName())
                        .visibility(topic.getVisibility())
                        .accessType(topic.getAccessType())
                        .approvalStatus(topic.getApprovalStatus())
                        .vocabularyCount(vocabularyRepository.countByTopicId(topic.getId()))
                        .build())
                .sorted(Comparator.comparingLong(AdminTopTopicResponse::getVocabularyCount).reversed())
                .limit(5)
                .toList();
    }

    private PaymentResponse mapPaymentToResponse(PaymentTransaction paymentTransaction) {
        return PaymentResponse.builder()
                .id(paymentTransaction.getId())
                .planType(paymentTransaction.getPlanType())
                .amount(paymentTransaction.getAmount())
                .status(paymentTransaction.getStatus())
                .provider(paymentTransaction.getProvider())
                .providerTransactionId(paymentTransaction.getProviderTransactionId())
                .createdAt(paymentTransaction.getCreatedAt())
                .paidAt(paymentTransaction.getPaidAt())
                .build();
    }
}
