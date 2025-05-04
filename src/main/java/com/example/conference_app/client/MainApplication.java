package com.example.conference_app.client;

import com.example.conference_app.client.modules.ConferenceModule;

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

        // Добавление модулей
        tabbedPane.addTab("Conferences", new ConferenceModule());
        //tabbedPane.addTab("Sections", new SectionModule());

        add(tabbedPane, BorderLayout.CENTER);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            MainApplication app = new MainApplication();
            app.setVisible(true);
        });
    }
}
