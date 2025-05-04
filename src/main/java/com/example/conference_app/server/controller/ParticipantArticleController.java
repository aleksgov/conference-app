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

    @GetMapping
    public List<ParticipantArticle> getAllParticipantArticles() {
        return participantArticleService.getAll();
    }

    @PostMapping
    public ParticipantArticle createParticipantArticle(@RequestBody ParticipantArticle participantArticle) {
        return participantArticleService.create(participantArticle);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteParticipantArticle(
            @RequestParam Long participantId,
            @RequestParam Long articleId) {
        participantArticleService.deleteParticipantArticle(participantId, articleId);
        return ResponseEntity.noContent().build();
    }
}
