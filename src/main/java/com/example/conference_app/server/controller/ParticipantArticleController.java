package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.ParticipantArticle;
import com.example.conference_app.server.service.ParticipantArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participant-articles")
public class ParticipantArticleController {

    @Autowired
    private ParticipantArticleService participantArticleService;

    // Получить все связи участник-статья
    @GetMapping
    public List<ParticipantArticle> getAllParticipantArticles() {
        return participantArticleService.getAllParticipantArticles();
    }

    // Создать новую связь участник-статья
    @PostMapping
    public ParticipantArticle createParticipantArticle(@RequestBody ParticipantArticle participantArticle) {
        return participantArticleService.createParticipantArticle(participantArticle);
    }

    // Удалить связь участник-статья по ID участника и статьи
    @DeleteMapping
    public ResponseEntity<Void> deleteParticipantArticle(
            @RequestParam Long participantId,
            @RequestParam Long articleId) {
        participantArticleService.deleteParticipantArticle(participantId, articleId);
        return ResponseEntity.noContent().build();
    }
}
