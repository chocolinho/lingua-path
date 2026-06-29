package com.lulu.englishlearningapp.dto;

import com.lulu.englishlearningapp.entity.SubscriptionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminTopUserResponse {

    private Long id;
    private String username;
    private String email;
    private Integer xp;
    private int level;
    private SubscriptionType subscriptionType;
}
