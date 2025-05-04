package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Participant;
import com.example.conference_app.server.service.ParticipantService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController extends BaseController<Participant, Long> {
    public ParticipantController(ParticipantService service) {
        super(service);
    }
}
