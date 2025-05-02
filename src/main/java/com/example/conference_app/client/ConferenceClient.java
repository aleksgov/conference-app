package com.example.conference_app.client;

import com.example.conference_app.server.model.Conference;
import org.springframework.web.client.RestTemplate;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.time.LocalDate;

public class ConferenceClient extends JFrame {
    private static final String BASE_URL = "http://localhost:8080/api/conferences";
    private static final RestTemplate restTemplate = new RestTemplate();

    private JTable conferenceTable;
    private DefaultTableModel tableModel;

    public ConferenceClient() {
        initializeUI();
        loadConferences();
    }

    private void initializeUI() {
        setTitle("Conference Manager");
        setSize(800, 600);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        tableModel = new DefaultTableModel();
        tableModel.addColumn("ID");
        tableModel.addColumn("Name");
        tableModel.addColumn("Start Date");
        tableModel.addColumn("End Date");

        conferenceTable = new JTable(tableModel);
        add(new JScrollPane(conferenceTable), BorderLayout.CENTER);

        JToolBar toolBar = new JToolBar();

        JButton refreshButton = new JButton("Refresh");
        JButton addButton = new JButton("Add");
        JButton deleteButton = new JButton("Delete");
        JButton searchButton = new JButton("Search");

        refreshButton.addActionListener(e -> loadConferences());
        addButton.addActionListener(e -> showAddConferenceDialog());
        deleteButton.addActionListener(e -> deleteConference());
        searchButton.addActionListener(e -> showSearchDialog());

        toolBar.add(refreshButton);
        toolBar.add(addButton);
        toolBar.add(deleteButton);
        toolBar.add(searchButton);

        add(toolBar, BorderLayout.NORTH);
    }

    private void loadConferences() {
        SwingWorker<Conference[], Void> worker = new SwingWorker<>() {
            @Override
            protected Conference[] doInBackground() throws Exception {
                return restTemplate.getForObject(BASE_URL, Conference[].class);
            }

            @Override
            protected void done() {
                try {
                    tableModel.setRowCount(0);
                    Conference[] conferences = get();
                    for (Conference conf : conferences) {
                        tableModel.addRow(new Object[]{
                                conf.getConferenceId(),
                                conf.getName(),
                                conf.getStartDate(),
                                conf.getEndDate()
                        });
                    }
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(ConferenceClient.this,
                            "Error loading conferences: " + ex.getMessage(),
                            "Error",
                            JOptionPane.ERROR_MESSAGE);
                }
            }
        };
        worker.execute();
    }

    private void showAddConferenceDialog() {
        JDialog dialog = new JDialog(this, "Add New Conference", true);
        dialog.setLayout(new GridLayout(4, 2));

        JTextField nameField = new JTextField();
        JTextField startDateField = new JTextField();
        JTextField endDateField = new JTextField();

        dialog.add(new JLabel("Name:"));
        dialog.add(nameField);
        dialog.add(new JLabel("Start Date (yyyy-MM-dd):"));
        dialog.add(startDateField);
        dialog.add(new JLabel("End Date (yyyy-MM-dd):"));
        dialog.add(endDateField);

        JButton submitButton = new JButton("Submit");
        submitButton.addActionListener(e -> {
            Conference conference = new Conference();
            conference.setName(nameField.getText());
            conference.setStartDate(LocalDate.parse(startDateField.getText()));
            conference.setEndDate(LocalDate.parse(endDateField.getText()));

            restTemplate.postForObject(BASE_URL, conference, Conference.class);
            loadConferences();
            dialog.dispose();
        });

        JButton cancelButton = new JButton("Cancel");
        cancelButton.addActionListener(e -> dialog.dispose());

        dialog.add(submitButton);
        dialog.add(cancelButton);
        dialog.pack();
        dialog.setLocationRelativeTo(this);
        dialog.setVisible(true);
    }

    private void deleteConference() {
        String id = JOptionPane.showInputDialog(this, "Enter Conference ID:");
        if (id != null && !id.isEmpty()) {
            restTemplate.delete(BASE_URL + "/" + id);
            loadConferences();
        }
    }

    private void showSearchDialog() {
        String id = JOptionPane.showInputDialog(this, "Enter Conference ID:");
        if (id != null && !id.isEmpty()) {
            Conference conference = restTemplate.getForObject(
                    BASE_URL + "/" + id,
                    Conference.class
            );

            if (conference != null) {
                JOptionPane.showMessageDialog(this,
                        "ID: " + conference.getConferenceId() + "\n" +
                                "Name: " + conference.getName() + "\n" +
                                "Start Date: " + conference.getStartDate() + "\n" +
                                "End Date: " + conference.getEndDate(),
                        "Conference Details",
                        JOptionPane.INFORMATION_MESSAGE);
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            ConferenceClient client = new ConferenceClient();
            client.setVisible(true);
        });
    }
}