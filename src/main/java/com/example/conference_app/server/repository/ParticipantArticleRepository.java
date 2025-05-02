package com.example.conference_app.server.repository;

import com.example.conference_app.server.model.ParticipantArticle;
import com.example.conference_app.server.model.ParticipantArticleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantArticleRepository extends JpaRepository<ParticipantArticle, ParticipantArticleId> {
}
