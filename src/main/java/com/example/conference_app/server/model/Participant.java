package com.example.conference_app.server.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties({"articlesLink", "applications", "user"})
@Setter
@Getter
@NoArgsConstructor
@Entity
public class Participant extends BaseEntity {

    private String organization;

    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParticipantArticle> articlesLink = new ArrayList<>();

    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConferenceApplication> applications = new ArrayList<>();
}
