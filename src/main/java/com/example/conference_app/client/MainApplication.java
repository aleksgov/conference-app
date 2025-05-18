package com.example.conference_app.client;

import com.example.conference_app.client.components.LoginDialog;
import com.example.conference_app.client.modules.*;
import com.formdev.flatlaf.FlatLightLaf;

import javax.swing.*;
import java.awt.*;

public class MainApplication extends JFrame {
    private final String userRole;

    public MainApplication(String userRole) {
        this.userRole = userRole;
        initUI();
    }

    private void initUI() {
        setTitle("Science Conference Management System");
        setSize(1200, 800);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        if ("ADMIN".equals(userRole)) {
            initAdminInterface();
        } else {
            initUserInterface();
        }
    }

    private void initAdminInterface() {
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

    private void initUserInterface() {
        JPanel userPanel = new JPanel(new BorderLayout());
        userPanel.add(new JLabel("<html><h1>Welcome to Conference Manager!</h1></html>", SwingConstants.CENTER), BorderLayout.CENTER);
        add(userPanel);
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel( new FlatLightLaf() );
        } catch( UnsupportedLookAndFeelException ex ) {
            ex.printStackTrace();
        }

        SwingUtilities.invokeLater(() -> {
            LoginDialog loginDialog = new LoginDialog(null);
            loginDialog.setVisible(true);

            if (!loginDialog.isLoggedIn()) {
                System.exit(0);
            }

            MainApplication app = new MainApplication(loginDialog.getUserRole());
            app.setLocationRelativeTo(null);
            app.setVisible(true);
        });
    }
}