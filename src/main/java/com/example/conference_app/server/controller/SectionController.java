package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Section;
import com.example.conference_app.server.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    @Autowired
    private SectionService sectionService;

    // Получить все секции
    @GetMapping
    public List<Section> getAllSections() {
        return sectionService.getAllSections();
    }

    // Получить секцию по ID
    @GetMapping("/{id}")
    public ResponseEntity<Section> getSectionById(@PathVariable Long id) {
        Section section = sectionService.getSectionById(id);
        return ResponseEntity.ok(section);
    }

    // Создать новую секцию
    @PostMapping
    public Section createSection(@RequestBody Section section) {
        return sectionService.createSection(section);
    }

    // Удалить секцию по ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}

