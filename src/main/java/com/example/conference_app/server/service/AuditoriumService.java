package com.example.conference_app.server.service;

import com.example.conference_app.server.model.Auditorium;
import com.example.conference_app.server.repository.AuditoriumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditoriumService {

    @Autowired
    private AuditoriumRepository auditoriumRepository;

    // Получить все аудитории
    public List<Auditorium> getAllAuditoriums() {
        return auditoriumRepository.findAll();
    }

    // Получить аудиторию по ID
    public Auditorium getAuditoriumById(Long id) {
        return auditoriumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auditorium not found"));
    }

    // Создать новую аудиторию
    public Auditorium createAuditorium(Auditorium auditorium) {
        return auditoriumRepository.save(auditorium);
    }

    // Удалить аудиторию по ID
    public void deleteAuditorium(Long id) {
        auditoriumRepository.deleteById(id);
    }
}
