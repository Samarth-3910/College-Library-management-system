package com.example.librarybackend.repository;

import com.example.librarybackend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
    // Spring Data JPA provides findAll(), findById(), save(), deleteById(), etc.
    // The <Book, String> means it's a repository for the Book entity,
    // and the ID of the Book entity is of type String.
}