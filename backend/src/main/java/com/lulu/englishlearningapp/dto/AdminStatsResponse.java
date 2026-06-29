package com.lulu.englishlearningapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminStatsResponse {

    private long totalUsers;
    private long freeUsers;
    private long premiumUsers;
    private long adminUsers;

    private long totalTopics;
    private long freeTopics;
    private long premiumTopics;
    private long publicTopics;
    private long pendingTopics;

    private long totalVocabularies;
    private long quizAttempts;

    private long totalPayments;
    private long successfulPayments;
    private long monthlySubscriptions;
    private long yearlySubscriptions;

    private java.util.List<PaymentResponse> recentPayments;
    private java.util.List<AdminTopUserResponse> topUsersByXp;
    private java.util.List<AdminTopTopicResponse> topTopicsByVocabularyCount;
}
