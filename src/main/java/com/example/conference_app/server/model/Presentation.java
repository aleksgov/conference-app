package com.example.conference_app.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Presentation extends BaseEntity {
    private String name;
    private String authors;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

}
