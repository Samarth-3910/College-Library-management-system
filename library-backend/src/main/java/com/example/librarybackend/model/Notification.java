package com.example.librarybackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private String userId; // Student ID who receives the notification

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 50)
    private String type; // "BOOK_ISSUED", "BOOK_RETURNED", "BOOK_OVERDUE", "RESERVATION_READY"

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Optional: Link to related entities
    @Column(name = "related_book_id")
    private String relatedBookId;

    @Column(name = "related_transaction_id")
    private Integer relatedTransactionId;

    // Constructors
    public Notification() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }

    public Notification(String userId, String message, String type) {
        this();
        this.userId = userId;
        this.message = message;
        this.type = type;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getRelatedBookId() {
        return relatedBookId;
    }

    public void setRelatedBookId(String relatedBookId) {
        this.relatedBookId = relatedBookId;
    }

    public Integer getRelatedTransactionId() {
        return relatedTransactionId;
    }

    public void setRelatedTransactionId(Integer relatedTransactionId) {
        this.relatedTransactionId = relatedTransactionId;
    }
}
