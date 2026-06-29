package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.TopicAccessType;
import com.lulu.englishlearningapp.entity.Topic;
import com.lulu.englishlearningapp.entity.TopicApprovalStatus;
import com.lulu.englishlearningapp.entity.TopicVisibility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {

    long countByOwnerId(Long ownerId);

    long countByAccessType(TopicAccessType accessType);

    long countByVisibility(TopicVisibility visibility);

    long countByApprovalStatus(TopicApprovalStatus approvalStatus);
}
