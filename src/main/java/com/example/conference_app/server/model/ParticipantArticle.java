package com.example.conference_app.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
@IdClass(ParticipantArticleId.class)
@Table(name = "participant_article")
public class ParticipantArticle {
    @Id
    @Column(name = "participant_id")
    private Long participantId;

    @Id
    @Column(name = "article_id")
    private Long articleId;

    @ManyToOne
    @JoinColumn(name = "participant_id", insertable = false, updatable = false)
    @JsonIgnoreProperties("articlesLink")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "article_id", insertable = false, updatable = false)
    @JsonIgnoreProperties("articlesLink")
    private Article article;
}
