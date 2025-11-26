package com.example.librarybackend.repository;

import com.example.librarybackend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // Find all notifications for a specific user, ordered by newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    // Find unread notifications for a user
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(String userId);

    // Count unread notifications for a user
    Long countByUserIdAndIsReadFalse(String userId);

    // Delete all notifications for a user
    void deleteByUserId(String userId);
}
