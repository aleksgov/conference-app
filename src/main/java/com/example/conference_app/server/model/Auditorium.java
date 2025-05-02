package com.example.conference_app.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Auditorium extends BaseEntity {
    private int capacity;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

}