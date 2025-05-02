package com.example.conference_app.server.service;

import com.example.conference_app.server.model.ParticipantArticle;
import com.example.conference_app.server.model.ParticipantArticleId;
import com.example.conference_app.server.repository.ParticipantArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantArticleService {

    @Autowired
    private ParticipantArticleRepository participantArticleRepository;

    // Получить все связи участник-статья
    public List<ParticipantArticle> getAllParticipantArticles() {
        return participantArticleRepository.findAll();
    }

    // Создать новую связь участник-статья
    public ParticipantArticle createParticipantArticle(ParticipantArticle participantArticle) {
        return participantArticleRepository.save(participantArticle);
    }

    // Удалить связь участник-статья по ID участника и статьи
    public void deleteParticipantArticle(Long participantId, Long articleId) {
        ParticipantArticleId id = new ParticipantArticleId(participantId, articleId);
        participantArticleRepository.deleteById(id);
    }
}
