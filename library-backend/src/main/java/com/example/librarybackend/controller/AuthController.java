package com.example.librarybackend.controller;

//Purpose: Handles user login (librarian and students).
import com.example.librarybackend.dto.LoginRequest;
import com.example.librarybackend.dto.LoginResponse;
import com.example.librarybackend.model.Student;
import com.example.librarybackend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
//Combines @Controller + @ResponseBody
//Methods return data (JSON), not views (HTML)

@CrossOrigin(origins = "http://localhost:3000") //CORS: Allows React app (port 3000) to call this API (port 8080)

@RequestMapping("/api/auth") //Base URL for all methods
public class AuthController {


//    @Autowired: Spring automatically provides the repository
//    No need to create new StudentRepository()

    @Autowired
    private StudentRepository studentRepository;

    // Password encoder for hashing
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Hardcoded librarian password (hashed)
    // Original password: "admin123"
    // Hashed using BCrypt
    private static final String LIBRARIAN_PASSWORD_HASH =
            "$2a$10$xLzKcF4dDQKLLLzKcF4dDO9qj6kqJ8dQKLLLzKcF4dDO9qj6kqJ8d";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) { //Deserializes JSON to LoginRequest object
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Validate input
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email is required");
        }

        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password is required");
        }

        // Check for the hardcoded Librarian user
        if ("librarian@library.com".equalsIgnoreCase(email)) {
            // Validate password
            // For demo: accept "admin123" as password
            if ("admin123".equals(password)) {
                LoginResponse response = new LoginResponse(
                        "L001",
                        "Librarian",
                        email,
                        "librarian"
                );
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid credentials");
            }
        }

        // If not the librarian, check if it's a student in the database
        Optional<Student> studentOptional = studentRepository.findByEmail(email);

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();

            // In production, validate password here:
            // if (!passwordEncoder.matches(password, student.getPasswordHash())) {
            //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            //         .body("Invalid credentials");
            // }

            // For now, accept any password for students (demo mode)
            LoginResponse response = new LoginResponse(
                    student.getId(),
                    student.getName(),
                    student.getEmail(),
                    "student"
            );
            return ResponseEntity.ok(response);
        }

        // If the email doesn't match the librarian or any student, it's invalid
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }

    /**
     * Helper method to hash passwords (for testing/setup)
     * In production, this would be used during registration
     */
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }

    /**
     * Helper method to verify passwords
     */
    public boolean verifyPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
}