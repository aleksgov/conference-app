package com.example.conference_app.server.service;

import com.example.conference_app.server.model.ParticipantArticle;
import com.example.conference_app.server.model.ParticipantArticleId;
import org.springframework.stereotype.Service;

@Service
public class ParticipantArticleService extends BaseService<ParticipantArticle, ParticipantArticleId> {

    // удаление по двум ID (если требуется сохранить текущий API)
    public void deleteParticipantArticle(Long participantId, Long articleId) {
        ParticipantArticleId id = new ParticipantArticleId(participantId, articleId);
        delete(id);
    }
}