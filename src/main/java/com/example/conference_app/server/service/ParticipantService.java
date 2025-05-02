package com.example.conference_app.server.service;

import com.example.conference_app.server.model.Participant;
import com.example.conference_app.server.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

    // Получить всех участников
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    // Получить участника по ID
    public Participant getParticipantById(Long id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant not found"));
    }

    // Создать нового участника
    public Participant createParticipant(Participant participant) {
        return participantRepository.save(participant);
    }

    // Удалить участника по ID
    public void deleteParticipant(Long id) {
        participantRepository.deleteById(id);
    }
}
