package com.apexrate.repository;

import com.apexrate.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndMessageAndCreatedAtAfter(Long userId, String message, LocalDateTime since);

    long countByUserIdAndIsReadFalse(Long userId);
}
