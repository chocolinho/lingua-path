package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.TopicAccessType;
import com.lulu.englishlearningapp.entity.TopicApprovalStatus;
import com.lulu.englishlearningapp.entity.TopicVisibility;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminTopTopicResponse {

    private Long id;
    private String name;
    private TopicVisibility visibility;
    private TopicAccessType accessType;
    private TopicApprovalStatus approvalStatus;
    private long vocabularyCount;
}
