package com.example.librarybackend.controller;

import com.example.librarybackend.dto.LoginRequest;
import com.example.librarybackend.dto.LoginResponse;
import com.example.librarybackend.model.Student;
import com.example.librarybackend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        // We are not using the password in this simple version, but it's here
        // String password = loginRequest.getPassword();

        // Check for the hardcoded Librarian user
        if ("librarian@library.com".equalsIgnoreCase(email)) {
            // In a real app, you would also validate the password here
            LoginResponse response = new LoginResponse("L001", "Librarian", email, "librarian");
            return ResponseEntity.ok(response);
        }

        // If not the librarian, check if it's a student in the database
        Optional<Student> studentOptional = studentRepository.findByEmail(email);

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            // In a real app, you would validate the student's password here
            LoginResponse response = new LoginResponse(student.getId(), student.getName(), student.getEmail(), "student");
            return ResponseEntity.ok(response);
        }

        // If the email doesn't match the librarian or any student, it's invalid
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}