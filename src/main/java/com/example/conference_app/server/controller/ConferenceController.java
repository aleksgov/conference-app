package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Conference;
import com.example.conference_app.server.service.ConferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conferences")
public class ConferenceController {

    @Autowired
    private ConferenceService conferenceService;

    // Получить все конференции
    @GetMapping
    public List<Conference> getAllConferences() {
        return conferenceService.getAllConferences();
    }

    // Получить конференцию по ID
    @GetMapping("/{id}")
    public ResponseEntity<Conference> getConferenceById(@PathVariable Long id) {
        Conference conference = conferenceService.getConferenceById(id);
        return ResponseEntity.ok(conference);
    }

    // Создать новую конференцию
    @PostMapping
    public Conference createConference(@RequestBody Conference conference) {
        return conferenceService.createConference(conference);
    }

    // Удалить конференцию по ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConference(@PathVariable Long id) {
        conferenceService.deleteConference(id);
        return ResponseEntity.noContent().build();
    }
}
