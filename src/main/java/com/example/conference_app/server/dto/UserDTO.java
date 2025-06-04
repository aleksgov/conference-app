package com.example.conference_app.server.dto;

import com.example.conference_app.server.model.User;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UserDTO {
    private Long id;
    private String email;
    private String role;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;

    public UserDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.fullName = user.getFullName();
        this.dateOfBirth = user.getDateOfBirth();
        this.gender = user.getGender().name();
        this.phone = user.getPhone();
    }
}