package com.example.conference_app.server.dto;

import com.example.conference_app.server.model.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProfileUpdateRequest {
    private String fullName;
    private LocalDate dateOfBirth;
    private String phone;
    private User.Gender gender;
}