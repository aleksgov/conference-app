package com.example.conference_app.server.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
public class Auditorium extends BaseEntity {
    private int capacity;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

}