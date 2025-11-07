package com.example.librarybackend.controller;

import com.example.librarybackend.model.Book;
import com.example.librarybackend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // This replaces the need for WebConfig for this controller
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    // === GET ALL BOOKS ===
    // Handles GET requests to /api/books
    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // === GET A SINGLE BOOK BY ID ===
    // Handles GET requests to /api/books/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        // Find the book by its ID. It returns an Optional in case the book doesn't exist.
        Optional<Book> book = bookRepository.findById(id);

        // We use ResponseEntity to have more control over the HTTP response.
        // If the book is present, we return it with a 200 OK status.
        // If not, we return a 404 Not Found status.
        return book.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // === CREATE A NEW BOOK ===
    // Handles POST requests to /api/books
    @PostMapping
    public Book addBook(@RequestBody Book book) {
        // The save() method handles both creating new items and updating existing ones.
        return bookRepository.save(book);
    }

    // === UPDATE AN EXISTING BOOK ===
    // Handles PUT requests to /api/books/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @RequestBody Book bookDetails) {
        return bookRepository.findById(id)
                .map(existingBook -> {
                    // Update the fields of the existing book with the new details
                    existingBook.setTitle(bookDetails.getTitle());
                    existingBook.setAuthor(bookDetails.getAuthor());
                    existingBook.setGenre(bookDetails.getGenre());
                    existingBook.setCopies(bookDetails.getCopies());
                    // Save the updated book back to the database
                    Book updatedBook = bookRepository.save(existingBook);
                    // Return the updated book with a 200 OK status
                    return ResponseEntity.ok(updatedBook);
                })
                // If the book with the given ID was not found, return 404 Not Found
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // === DELETE A BOOK ===
    // Handles DELETE requests to /api/books/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable String id) {
        return bookRepository.findById(id)
                .map(book -> {
                    // If the book exists, delete it
                    bookRepository.delete(book);
                    // Return a 204 No Content status, which is standard for successful deletions
                    return ResponseEntity.noContent().build();
                })
                // If the book to be deleted was not found, return 404 Not Found
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}