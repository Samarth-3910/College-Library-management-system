package com.example.librarybackend.controller;

import com.example.librarybackend.dto.ReservationResponse;
import com.example.librarybackend.exception.ResourceNotFoundException;
import com.example.librarybackend.model.Book;
import com.example.librarybackend.model.Reservation;
import com.example.librarybackend.model.Student;
import com.example.librarybackend.repository.BookRepository;
import com.example.librarybackend.repository.ReservationRepository;
import com.example.librarybackend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired private ReservationRepository reservationRepository;
    @Autowired private BookRepository bookRepository;
    @Autowired private StudentRepository studentRepository;

    // Helper method to convert Reservation entity to DTO with flat structure
    private ReservationResponse convertToDto(Reservation reservation) {
        ReservationResponse dto = new ReservationResponse();
        dto.setId(reservation.getId());
        dto.setBookId(reservation.getBook().getId());
        dto.setBookTitle(reservation.getBook().getTitle());
        dto.setStudentId(reservation.getStudent().getId());
        dto.setStudentName(reservation.getStudent().getName());
        dto.setReservationDate(reservation.getReservationDate());
        return dto;
    }

    // GET all reservations - Returns flat structure with bookId and studentId
    @GetMapping
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // POST - Create a new reservation
    @PostMapping
    public ReservationResponse createReservation(@RequestBody Map<String, String> payload) {
        String bookId = payload.get("bookId");
        String studentId = payload.get("studentId");

        // Validate that book exists
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        // Validate that student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Create reservation
        Reservation reservation = new Reservation();
        reservation.setBook(book);
        reservation.setStudent(student);
        reservation.setReservationDate(LocalDateTime.now());

        Reservation savedReservation = reservationRepository.save(reservation);

        // Return DTO with flat structure
        return convertToDto(savedReservation);
    }

    // DELETE a reservation (when fulfilled or cancelled)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Integer id) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservationRepository.delete(reservation);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}