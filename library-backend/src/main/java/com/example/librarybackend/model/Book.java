package com.example.librarybackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // Tells JPA this class is an entity that maps to a database table
@Table(name = "books") // Specifies the table name
public class Book {
    @Id // Marks this field as the primary key
    private String id; // ISBN

    private String title;
    private String author;
    private String genre;
    private int copies;

    // Getters and Setters are required by JPA
    // You can generate these automatically in your IDE
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public int getCopies() { return copies; }
    public void setCopies(int copies) { this.copies = copies; }
}