package com.example.conference_app.server.service;

import com.example.conference_app.server.model.Presentation;
import com.example.conference_app.server.repository.PresentationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PresentationService {

    @Autowired
    private PresentationRepository presentationRepository;

    // Получить все презентации
    public List<Presentation> getAllPresentations() {
        return presentationRepository.findAll();
    }

    // Получить презентацию по ID
    public Presentation getPresentationById(Long id) {
        return presentationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presentation not found"));
    }

    // Создать новую презентацию
    public Presentation createPresentation(Presentation presentation) {
        return presentationRepository.save(presentation);
    }

    // Удалить презентацию по ID
    public void deletePresentation(Long id) {
        presentationRepository.deleteById(id);
    }
}
