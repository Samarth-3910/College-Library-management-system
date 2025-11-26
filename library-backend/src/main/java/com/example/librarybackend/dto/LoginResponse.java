package com.example.librarybackend.dto;

//Sends login result back to frontend.
// This class represents the JSON response we send back on successful login.
// The frontend will use these fields (especially 'role') to decide what to do next.
public class LoginResponse {
    private String id;
    private String name;
    private String email;
    private String role;

    // Constructor to make creating new responses easy
    //new LoginResponse("S001", "John", "john@example.com", "student") backend send these in JSON format
    public LoginResponse(String id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // --- Getters and Setters ---
    // Spring needs these to convert this object into JSON.
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
}