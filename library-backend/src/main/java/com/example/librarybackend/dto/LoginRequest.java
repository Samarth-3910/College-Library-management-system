package com.example.librarybackend.dto;

//Receives login credentials from frontend.
// This class represents the JSON body of a login request.
// It must have fields that match the keys in the JSON object sent from the frontend.
//Spring uses these to deserialize JSON
public class LoginRequest {
    private String email;
    private String password;

    // --- Getters and Setters ---
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}

//Frontend sends:
//        {
//        "email": "student@example.com",
//        "password": "password123"
//        }

//Spring automatically maps JSON to "this" object!
//public String getEmail() { return email; }
//public void setEmail(String email) { this.email = email; }