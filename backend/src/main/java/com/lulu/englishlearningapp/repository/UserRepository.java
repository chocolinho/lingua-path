package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.SubscriptionType;
import com.lulu.englishlearningapp.entity.Role;
import com.lulu.englishlearningapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    long countBySubscriptionType(SubscriptionType subscriptionType);

    long countByRole(Role role);

    List<User> findByOrderByXpDesc(Pageable pageable);
}
