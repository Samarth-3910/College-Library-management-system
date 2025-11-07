package com.example.librarybackend.repository;

import com.example.librarybackend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    // We don't need any custom methods for now. JpaRepository gives us everything.
    // The <Transaction, Integer> specifies the entity and its primary key type.
}