package com.example.librarybackend.dto;

public class TransactionDto {
    private String bookId;
    private String studentId;

    // --- Getters and Setters ---
    public String getBookId() {
        return bookId;
    }
    public void setBookId(String bookId) {
        this.bookId = bookId;
    }
    public String getStudentId() {
        return studentId;
    }
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}