package com.example.librarybackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//Configure CORS globally.
@Configuration  //Marks this as a configuration class
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Allow CORS for all /api endpoints
                .allowedOrigins("http://localhost:3000") // Allow your React app's origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}


//CORS configuration
// api/**: Apply to all API endpoints
//allowedOrigins: Allow React app
//allowedMethods: Allow these HTTP methods
//Why CORS?
//Browser security prevents cross-origin requests
//React (port 3000) → Spring Boot (port 8080) = cross-origin
//This config allows it