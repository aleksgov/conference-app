package com.example.conference_app.server.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@JsonIgnoreProperties({"participant", "conference", "section", "article"})
@Setter
@Getter
@NoArgsConstructor
@Entity
public class ConferenceApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "conference_id")
    private Conference conference;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String adminComment;

    public enum ApplicationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}