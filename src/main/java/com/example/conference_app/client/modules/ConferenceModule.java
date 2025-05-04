package com.example.conference_app.client.modules;

import com.example.conference_app.server.model.Conference;
import org.springframework.web.client.RestTemplate;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.time.LocalDate;

public class ConferenceModule extends JPanel {
    private static final String BASE_URL = "http://localhost:8080/api/conferences";
    private final RestTemplate restTemplate = new RestTemplate();
    private final DefaultTableModel tableModel = new DefaultTableModel();

    public ConferenceModule() {
        initializeUI();
        loadConferences();
    }

    private void initializeUI() {
        setLayout(new BorderLayout());
        initTable();
        initToolbar();
    }

    private void initTable() {
        tableModel.addColumn("ID");
        tableModel.addColumn("Name");
        tableModel.addColumn("Start Date");
        tableModel.addColumn("End Date");

        JTable table = new JTable(tableModel);
        table.setAutoCreateRowSorter(true);
        add(new JScrollPane(table), BorderLayout.CENTER);
    }

    private void initToolbar() {
        JToolBar toolBar = new JToolBar();

        toolBar.add(createButton("Refresh", this::loadConferences));
        toolBar.add(createButton("Add", this::showAddDialog));
        toolBar.add(createButton("Delete", this::deleteConference));
        toolBar.add(createButton("Details", this::showDetailsDialog));

        add(toolBar, BorderLayout.NORTH);
    }

    private JButton createButton(String text, Runnable action) {
        JButton button = new JButton(text);
        button.addActionListener((ActionEvent e) -> action.run());
        return button;
    }

    private void loadConferences() {
        SwingWorker<Conference[], Void> worker = new SwingWorker<>() {
            @Override
            protected Conference[] doInBackground() {
                return restTemplate.getForObject(BASE_URL, Conference[].class);
            }

            @Override
            protected void done() {
                try {
                    tableModel.setRowCount(0);
                    for (Conference conf : get()) {
                        tableModel.addRow(new Object[]{
                                conf.getConferenceId(),
                                conf.getName(),
                                conf.getStartDate(),
                                conf.getEndDate()
                        });
                    }
                } catch (Exception ex) {
                    showError("Error loading conferences: " + ex.getMessage());
                }
            }
        };
        worker.execute();
    }

    private void showAddDialog() {
        JDialog dialog = new JDialog((Frame) null, "New Conference", true);
        dialog.setLayout(new GridLayout(0, 2, 5, 5));

        JTextField nameField = new JTextField();
        JTextField startDateField = new JTextField();
        JTextField endDateField = new JTextField();

        dialog.add(new JLabel("Name:"));
        dialog.add(nameField);
        dialog.add(new JLabel("Start Date (yyyy-MM-dd):"));
        dialog.add(startDateField);
        dialog.add(new JLabel("End Date (yyyy-MM-dd):"));
        dialog.add(endDateField);

        JButton submit = new JButton("Save");
        submit.addActionListener(e -> {
            try {
                Conference conference = new Conference();
                conference.setName(nameField.getText());
                conference.setStartDate(LocalDate.parse(startDateField.getText()));
                conference.setEndDate(LocalDate.parse(endDateField.getText()));

                restTemplate.postForObject(BASE_URL, conference, Conference.class);
                loadConferences();
                dialog.dispose();
            } catch (Exception ex) {
                showError("Invalid data format: " + ex.getMessage());
            }
        });

        dialog.add(submit);
        dialog.add(createCancelButton(dialog));
        dialog.pack();
        dialog.setLocationRelativeTo(this);
        dialog.setVisible(true);
    }

    private void deleteConference() {
        JScrollPane scroll = (JScrollPane) getComponent(0);
        JTable table = (JTable) scroll.getViewport().getView();

        int selectedRow = table.getSelectedRow();
        if (selectedRow == -1) {
            showError("Please select a conference first");
            return;
        }

        int modelRow = table.convertRowIndexToModel(selectedRow);
        Long id = (Long) tableModel.getValueAt(modelRow, 0);

        restTemplate.delete(BASE_URL + "/" + id);
        loadConferences();
    }


    private void showDetailsDialog() {
        JScrollPane scroll = (JScrollPane) getComponent(0);
        JTable table = (JTable) scroll.getViewport().getView();

        int viewRow = table.getSelectedRow();
        if (viewRow == -1) {
            showError("Please select a conference first");
            return;
        }

        int modelRow = table.convertRowIndexToModel(viewRow);
        Long id = (Long) tableModel.getValueAt(modelRow, 0);

        Conference conference = restTemplate.getForObject(BASE_URL + "/" + id, Conference.class);
        if (conference == null) {
            showError("Conference not found or could not be loaded.");
            return;
        }

        JOptionPane.showMessageDialog(
                this,
                "Conference Details:\n\n" +
                        "ID: " + conference.getConferenceId() + "\n" +
                        "Name: " + conference.getName() + "\n" +
                        "Start: " + conference.getStartDate() + "\n" +
                        "End: " + conference.getEndDate(),
                "Conference Details",
                JOptionPane.INFORMATION_MESSAGE
        );
    }

    private JButton createCancelButton(JDialog dialog) {
        JButton button = new JButton("Cancel");
        button.addActionListener(e -> dialog.dispose());
        return button;
    }

    private void showError(String message) {
        JOptionPane.showMessageDialog(this, message, "Error", JOptionPane.ERROR_MESSAGE);
    }
}