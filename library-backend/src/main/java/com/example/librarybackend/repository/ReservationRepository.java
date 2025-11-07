package com.example.librarybackend.repository;

import com.example.librarybackend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    // JpaRepository provides all the necessary methods (findAll, save, deleteById, etc.)
}