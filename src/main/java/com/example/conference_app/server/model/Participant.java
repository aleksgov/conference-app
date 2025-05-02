package com.example.conference_app.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Participant extends BaseEntity {
    private String fullName;
    private String organization;

}
