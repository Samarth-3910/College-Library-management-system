package com.example.librarybackend.repository;

import com.example.librarybackend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {

    // This is the custom method our AuthController needs.
    // Spring Data JPA automatically understands this method name and implements it for us.
    Optional<Student> findByEmail(String email);
}