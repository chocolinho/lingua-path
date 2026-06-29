package com.lulu.englishlearningapp.repository;

import com.lulu.englishlearningapp.entity.PaymentTransaction;
import com.lulu.englishlearningapp.entity.PaymentStatus;
import com.lulu.englishlearningapp.entity.SubscriptionPlanType;
import com.lulu.englishlearningapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    List<PaymentTransaction> findByUserOrderByCreatedAtDesc(User user);

    long countByStatus(PaymentStatus status);

    long countByPlanType(SubscriptionPlanType planType);

    List<PaymentTransaction> findTop5ByOrderByCreatedAtDesc();
}
