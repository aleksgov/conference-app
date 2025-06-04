package com.example.conference_app.server.controller;

import com.example.conference_app.server.dto.ProfileUpdateRequest;
import com.example.conference_app.server.model.User;
import com.example.conference_app.server.service.UserService;
import com.example.conference_app.server.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public ProfileController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userService.getUserByEmail(email);

            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "dateOfBirth", user.getDateOfBirth(),
                "gender", user.getGender().name(),
                "phone", user.getPhone()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
        @RequestHeader("Authorization") String token,
        @RequestBody ProfileUpdateRequest request
    ) {
        try {
            String email = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User updatedUser = userService.updateUserProfile(
                email,
                request.getFullName(),
                request.getDateOfBirth(),
                request.getPhone(),
                request.getGender()
            );

            return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "user", updatedUser
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}