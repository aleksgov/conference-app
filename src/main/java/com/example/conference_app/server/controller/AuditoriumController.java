package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Auditorium;
import com.example.conference_app.server.service.AuditoriumService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auditoriums")
public class AuditoriumController extends BaseController<Auditorium, Long> {
    public AuditoriumController(AuditoriumService service) {
        super(service);
    }
}
