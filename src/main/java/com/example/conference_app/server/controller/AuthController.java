package com.example.conference_app.server.controller;

import com.example.conference_app.server.dto.LoginRequest;
import com.example.conference_app.server.dto.LoginResponse;
import com.example.conference_app.server.dto.RegistrationRequest;
import com.example.conference_app.server.model.User;
import com.example.conference_app.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(user));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegistrationRequest request) {
        User user = userService.register(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(user));
    }
}