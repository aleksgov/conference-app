package com.example.conference_app.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Article extends BaseEntity {
    private String name;
    private int pages;
    private String authors;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;
}