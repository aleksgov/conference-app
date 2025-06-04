package com.example.conference_app.server.service;

import com.example.conference_app.server.dto.ConferenceApplicationDTO;
import com.example.conference_app.server.model.*;
import com.example.conference_app.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConferenceApplicationService {

    private final ConferenceApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ConferenceRepository conferenceRepository;
    private final SectionRepository sectionRepository;
    private final ParticipantRepository participantRepository;
    private final ArticleRepository articleRepository;
    private final ParticipantArticleRepository participantArticleRepository;

    @Autowired
    public ConferenceApplicationService(
            ConferenceApplicationRepository applicationRepository,
            UserRepository userRepository,
            ConferenceRepository conferenceRepository,
            SectionRepository sectionRepository,
            ParticipantRepository participantRepository,
            ArticleRepository articleRepository,
            ParticipantArticleRepository participantArticleRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.conferenceRepository = conferenceRepository;
        this.sectionRepository = sectionRepository;
        this.participantRepository = participantRepository;
        this.articleRepository = articleRepository;
        this.participantArticleRepository = participantArticleRepository;
    }

    @Transactional
    public ConferenceApplication createApplication(ConferenceApplicationDTO dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Conference conference = conferenceRepository.findById(dto.getConferenceId())
                .orElseThrow(() -> new RuntimeException("Conference not found with id: " + dto.getConferenceId()));

        Section section = sectionRepository.findById(dto.getSectionId())
                .orElseThrow(() -> new RuntimeException("Section not found with id: " + dto.getSectionId()));

        ConferenceApplication application = new ConferenceApplication();
        application.setUser(user);
        application.setConference(conference);
        application.setSection(section);
        application.setArticleTitle(dto.getArticleTitle());
        application.setStatus(ConferenceApplication.ApplicationStatus.PENDING);
        application.setSubmittedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    public List<ConferenceApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    @Transactional
    public ConferenceApplication approveApplication(Long id) {
        ConferenceApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        Participant participant = createParticipantForUser(application.getUser());

        Article article = createArticleFromApplication(application);

        createParticipantArticleLink(participant, article);

        application.setStatus(ConferenceApplication.ApplicationStatus.APPROVED);
        application.setReviewedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    private Participant createParticipantForUser(User user) {
        if (user.getParticipant() != null) {
            return user.getParticipant();
        }

        Participant participant = new Participant();
        participant.setOrganization("");
        participant = participantRepository.save(participant);

        user.setParticipant(participant);
        userRepository.save(user);

        return participant;
    }

    private Article createArticleFromApplication(ConferenceApplication application) {
        Article article = new Article();
        article.setName(application.getArticleTitle());
        article.setPages(0);
        article.setSection(application.getSection());
        return articleRepository.save(article);
    }

    private void createParticipantArticleLink(Participant participant, Article article) {
        ParticipantArticle link = new ParticipantArticle();
        link.setParticipant(participant);
        link.setArticle(article);
        participantArticleRepository.save(link);
    }

    @Transactional
    public ConferenceApplication rejectApplication(Long id, String comment) {
        ConferenceApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        application.setStatus(ConferenceApplication.ApplicationStatus.REJECTED);
        application.setReviewedAt(LocalDateTime.now());
        application.setAdminComment(comment);

        return applicationRepository.save(application);
    }
}