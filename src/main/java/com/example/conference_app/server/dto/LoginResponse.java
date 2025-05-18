package com.example.conference_app.server.dto;

import com.example.conference_app.server.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class LoginResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("email")
    private String email;

    @JsonProperty("role")
    private String role;

    public LoginResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.role = user.getRole().name();
    }

    public LoginResponse() {}
}