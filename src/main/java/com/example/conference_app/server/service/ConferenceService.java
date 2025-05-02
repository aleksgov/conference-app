package com.example.conference_app.server.service;

import com.example.conference_app.server.model.Conference;
import com.example.conference_app.server.repository.ConferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConferenceService {

    @Autowired
    private ConferenceRepository conferenceRepository;

    // Получить все конференции
    public List<Conference> getAllConferences() {
        return conferenceRepository.findAll();
    }

    // Получить конференцию по ID
    public Conference getConferenceById(Long id) {
        return conferenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conference not found"));
    }

    // Создать новую конференцию
    public Conference createConference(Conference conference) {
        return conferenceRepository.save(conference);
    }

    // Удалить конференцию по ID
    public void deleteConference(Long id) {
        conferenceRepository.deleteById(id);
    }
}
