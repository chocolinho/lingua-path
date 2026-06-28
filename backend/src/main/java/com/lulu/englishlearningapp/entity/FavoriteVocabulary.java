package com.lulu.englishlearningapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "favorite_vocabularies",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "vocabulary_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteVocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vocabulary_id")
    private Vocabulary vocabulary;

    private LocalDateTime createdAt;
}
