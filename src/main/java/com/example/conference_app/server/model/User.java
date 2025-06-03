package com.example.conference_app.server.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;


@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String fullName;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender = Gender.UNSPECIFIED;

    @Column(nullable = true)
    private String phone;

    @OneToOne
    @JoinColumn(name = "participant_id", unique = true)
    private Participant participant;

    public enum Role {
        ADMIN, USER
    }

    public enum Gender {
        MALE, FEMALE, OTHER, UNSPECIFIED
    }
}