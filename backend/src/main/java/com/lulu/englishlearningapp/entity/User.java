package com.lulu.englishlearningapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String password;

    @Builder.Default
    private Integer xp = 0;

    @Builder.Default
    private Integer dailyStreak = 0;

    private LocalDate lastLearningDate;
}
