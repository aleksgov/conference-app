package com.example.conference_app.server.controller;

import com.example.conference_app.server.dto.ConferenceApplicationDTO;
import com.example.conference_app.server.model.ConferenceApplication;
import com.example.conference_app.server.service.ConferenceApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ConferenceApplicationController {

    private final ConferenceApplicationService applicationService;

    public ConferenceApplicationController(ConferenceApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ConferenceApplication> createApplication(
            @RequestBody ConferenceApplicationDTO dto, Principal principal) {

        ConferenceApplication application = applicationService.createApplication(dto, principal.getName());
        return ResponseEntity.ok(application);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConferenceApplication>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConferenceApplication> approveApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.approveApplication(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConferenceApplication> rejectApplication(
            @PathVariable Long id,
            @RequestBody(required = false) String comment) {
        return ResponseEntity.ok(applicationService.rejectApplication(id, comment != null ? comment : ""));
    }
}