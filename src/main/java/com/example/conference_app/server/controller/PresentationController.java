package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Presentation;
import com.example.conference_app.server.service.PresentationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/presentations")
public class PresentationController extends BaseController<Presentation, Long> {
    public PresentationController(PresentationService service) {
        super(service);
    }
}

