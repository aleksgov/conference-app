package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Presentation;
import com.example.conference_app.server.service.PresentationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presentations")
public class PresentationController {

    @Autowired
    private PresentationService presentationService;

    // Получить все презентации
    @GetMapping
    public List<Presentation> getAllPresentations() {
        return presentationService.getAllPresentations();
    }

    // Получить презентацию по ID
    @GetMapping("/{id}")
    public ResponseEntity<Presentation> getPresentationById(@PathVariable Long id) {
        Presentation presentation = presentationService.getPresentationById(id);
        return ResponseEntity.ok(presentation);
    }

    // Создать новую презентацию
    @PostMapping
    public Presentation createPresentation(@RequestBody Presentation presentation) {
        return presentationService.createPresentation(presentation);
    }

    // Удалить презентацию по ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePresentation(@PathVariable Long id) {
        presentationService.deletePresentation(id);
        return ResponseEntity.noContent().build();
    }
}

