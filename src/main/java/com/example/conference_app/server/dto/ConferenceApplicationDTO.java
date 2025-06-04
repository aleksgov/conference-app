package com.example.conference_app.server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConferenceApplicationDTO {
    private Long conferenceId;
    private Long sectionId;
    private String articleTitle;
}