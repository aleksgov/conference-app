package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Section;
import com.example.conference_app.server.service.SectionService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sections")
public class SectionController extends BaseController<Section, Long> {
    public SectionController(SectionService service) {
        super(service);
    }
}