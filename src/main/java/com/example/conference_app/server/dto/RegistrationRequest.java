package com.example.conference_app.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequest {
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    private String password;

    @NotBlank
    private String fullName;

    private LocalDate dateOfBirth;

    private String phone;

    private Gender gender = Gender.UNSPECIFIED;

    public enum Gender {
            MALE,
            FEMALE,
            UNSPECIFIED
        }
}