package com.example.librarybackend.controller;

import com.example.librarybackend.dto.TransactionDto;
import com.example.librarybackend.dto.TransactionResponse;
import com.example.librarybackend.exception.ResourceNotFoundException;
import com.example.librarybackend.model.Book;
import com.example.librarybackend.model.Reservation;
import com.example.librarybackend.model.Student;
import com.example.librarybackend.model.Transaction;
import com.example.librarybackend.repository.BookRepository;
import com.example.librarybackend.repository.ReservationRepository;
import com.example.librarybackend.repository.StudentRepository;
import com.example.librarybackend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired private TransactionRepository transactionRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private ReservationRepository reservationRepository;

    // Helper method to convert Transaction Entity to TransactionResponse DTO
    private TransactionResponse convertToDto(Transaction transaction) {
        TransactionResponse dto = new TransactionResponse();
        dto.setId(transaction.getId());
        dto.setBookId(transaction.getBook().getId());
        dto.setBookTitle(transaction.getBook().getTitle());
        dto.setStudentId(transaction.getStudent().getId());
        dto.setStudentName(transaction.getStudent().getName());
        dto.setIssueDate(transaction.getIssueDate());
        dto.setDueDate(transaction.getDueDate());
        dto.setReturnDate(transaction.getReturnDate());
        dto.setFinePaid(transaction.getFinePaid());
        return dto;
    }

    // GET all transactions
    @GetMapping
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // POST - Issue a new book (Create Transaction)
    @PostMapping
    public ResponseEntity<TransactionResponse> issueBook(@RequestBody TransactionDto transactionDto) {
        // Find book by ID from database
        Book book = bookRepository.findById(transactionDto.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        // Find student by ID from database
        Student student = studentRepository.findById(transactionDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Check if book has available copies
        if (book.getCopies() <= 0) {
            return ResponseEntity.badRequest().body(null);
        }

        // Decrease book copies by 1
        book.setCopies(book.getCopies() - 1);
        bookRepository.save(book);

        // Create new transaction
        Transaction transaction = new Transaction();
        transaction.setBook(book);
        transaction.setStudent(student);
        transaction.setIssueDate(LocalDateTime.now());
        transaction.setDueDate(LocalDateTime.now().plusDays(15)); // 15 days loan period

        Transaction savedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(convertToDto(savedTransaction));
    }

    // PUT - Return a book (Update Transaction)
    // THIS WAS MISSING! This is critical for returning books
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> returnBook(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> payload) {

        // Find the transaction
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // Check if already returned
        if (transaction.getReturnDate() != null) {
            return ResponseEntity.badRequest().body(null);
        }

        // Set return date to now
        transaction.setReturnDate(LocalDateTime.now());

        // Set fine if provided in payload
        if (payload.containsKey("finePaid")) {
            Object fineValue = payload.get("finePaid");
            if (fineValue instanceof Number) {
                transaction.setFinePaid(BigDecimal.valueOf(((Number) fineValue).doubleValue()));
            }
        }

        // Increase book copies by 1 (book is now available again)
        Book book = transaction.getBook();
        book.setCopies(book.getCopies() + 1);
        bookRepository.save(book);

        // Handle reservation fulfillment if reservation ID is provided
        if (payload.containsKey("reservationIdToFulfill")) {
            Object resIdObj = payload.get("reservationIdToFulfill");
            if (resIdObj != null) {
                Integer reservationId = Integer.valueOf(resIdObj.toString());
                reservationRepository.findById(reservationId).ifPresent(reservation -> {
                    reservationRepository.delete(reservation);
                });
            }
        }

        Transaction updatedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(convertToDto(updatedTransaction));
    }
}