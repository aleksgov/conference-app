package com.example.conference_app.server.controller;

import com.example.conference_app.server.dto.LoginRequest;
import com.example.conference_app.server.dto.LoginResponse;
import com.example.conference_app.server.dto.RegistrationRequest;
import com.example.conference_app.server.model.User;
import com.example.conference_app.server.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import com.example.conference_app.server.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", new LoginResponse(user)
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegistrationRequest request) {
        User.Gender userGender = convertGender(request.getGender());

        User user = userService.register(
            request.getEmail(),
            request.getPassword(),
            request.getFullName(),
            request.getDateOfBirth(),
            request.getPhone(),
            userGender
        );
        return ResponseEntity.ok(new LoginResponse(user));
    }

    private User.Gender convertGender(RegistrationRequest.Gender dtoGender) {
        if (dtoGender == null) return User.Gender.UNSPECIFIED;

        switch (dtoGender) {
            case MALE:
                return User.Gender.MALE;
            case FEMALE:
                return User.Gender.FEMALE;
            case UNSPECIFIED:
            default:
                return User.Gender.UNSPECIFIED;
        }
    }
}