package com.example.conference_app.server.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;

@JsonIgnoreProperties("sections")
@Setter
@Getter
@NoArgsConstructor
@Entity
public class Conference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @JsonProperty("conference_id")
    private Long conferenceId;

    @JsonProperty("name")
    private String name;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @OneToMany(mappedBy = "conference", cascade = CascadeType.ALL)
    private List<Section> sections = new ArrayList<>();

    @Override
    public String toString() {
        return "Conference{" +
                "conferenceId=" + conferenceId +
                ", name='" + name + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                '}';
    }

}
