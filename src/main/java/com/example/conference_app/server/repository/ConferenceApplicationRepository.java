package com.example.conference_app.server.repository;

import com.example.conference_app.server.model.ConferenceApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConferenceApplicationRepository extends JpaRepository<ConferenceApplication, Long> {
}