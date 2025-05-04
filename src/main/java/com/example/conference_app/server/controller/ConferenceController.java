package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Conference;
import com.example.conference_app.server.service.ConferenceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conferences")
public class ConferenceController extends BaseController<Conference, Long> {
    public ConferenceController(ConferenceService service) {
        super(service);
    }
}