package com.example.conference_app.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@IdClass(ParticipantArticleId.class)
public class ParticipantArticle {
    @Id
    @Column(name = "participant_id")
    private Long participantId;

    @Id
    @Column(name = "article_id")
    private Long articleId;

}
