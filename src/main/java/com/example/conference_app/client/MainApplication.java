package com.example.conference_app.client;

import com.example.conference_app.client.modules.*;

import javax.swing.*;
import java.awt.*;

public class MainApplication extends JFrame {
    
    public MainApplication() {
        initUI();
    }

    private void initUI() {
        setTitle("Science Conference Management System");
        setSize(1200, 800);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        JTabbedPane tabbedPane = new JTabbedPane();

        // добавление модулей
        tabbedPane.addTab("Conferences", new ConferenceModule());
        tabbedPane.addTab("Sections", new SectionModule());
        tabbedPane.addTab("Auditoriums", new AuditoriumModule());
        tabbedPane.addTab("Articles", new ArticleModule());
        tabbedPane.addTab("Presentations", new PresentationModule());
        tabbedPane.addTab("Participants", new ParticipantModule());


        add(tabbedPane, BorderLayout.CENTER);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            MainApplication app = new MainApplication();
            app.setVisible(true);
        });
    }
}
