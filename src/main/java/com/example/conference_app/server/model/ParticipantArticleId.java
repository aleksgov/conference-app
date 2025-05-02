package com.example.conference_app.server.model;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
public class ParticipantArticleId implements Serializable {
    private Long participantId;
    private Long articleId;

    public ParticipantArticleId(Long participantId, Long articleId) {
        this.participantId = participantId;
        this.articleId = articleId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParticipantArticleId that = (ParticipantArticleId) o;
        return Objects.equals(participantId, that.participantId) && Objects.equals(articleId, that.articleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(participantId, articleId);
    }
}
