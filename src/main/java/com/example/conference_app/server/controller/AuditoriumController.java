package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Auditorium;
import com.example.conference_app.server.service.AuditoriumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditoriums")
public class AuditoriumController {

    @Autowired
    private AuditoriumService auditoriumService;

    // Получить все аудитории
    @GetMapping
    public List<Auditorium> getAllAuditoriums() {
        return auditoriumService.getAllAuditoriums();
    }

    // Получить аудиторию по ID
    @GetMapping("/{id}")
    public ResponseEntity<Auditorium> getAuditoriumById(@PathVariable Long id) {
        Auditorium auditorium = auditoriumService.getAuditoriumById(id);
        return ResponseEntity.ok(auditorium);
    }

    // Создать новую аудиторию
    @PostMapping
    public Auditorium createAuditorium(@RequestBody Auditorium auditorium) {
        return auditoriumService.createAuditorium(auditorium);
    }

    // Удалить аудиторию по ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuditorium(@PathVariable Long id) {
        auditoriumService.deleteAuditorium(id);
        return ResponseEntity.noContent().build();
    }
}
