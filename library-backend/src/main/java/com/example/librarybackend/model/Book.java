package com.example.librarybackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // Tells JPA this class is an entity that maps to a database table or create a database table for this class
@Table(name = "books") // Specifies the table name
public class Book {
    @Id // Marks this field as the primary key
    private String id; // ISBN

    private String title;
    private String author;
    private String genre;
    private int copies;

    @Column(name = "image_path", length = 500)
    private String imagePath; // Stores the filename of the uploaded image

    // Getters and Setters are required by JPA Used to read/write private fields
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public int getCopies() {
        return copies;
    }

    public void setCopies(int copies) {
        this.copies = copies;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}