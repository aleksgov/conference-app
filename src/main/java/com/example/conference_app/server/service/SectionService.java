package com.example.conference_app.server.service;

import com.example.conference_app.server.model.Section;
import com.example.conference_app.server.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectionService {

    @Autowired
    private SectionRepository sectionRepository;

    // Получить все секции
    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    // Получить секцию по ID
    public Section getSectionById(Long id) {
        return sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
    }

    // Создать новую секцию
    public Section createSection(Section section) {
        return sectionRepository.save(section);
    }

    // Удалить секцию по ID
    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }
}
