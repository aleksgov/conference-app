package com.example.conference_app.client.modules;

import com.example.conference_app.server.model.Conference;
import com.example.conference_app.server.model.Section;
import org.springframework.web.client.RestTemplate;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

public class SectionModule extends JPanel {
    private static final String SECTIONS_URL = "http://localhost:8080/api/sections";
    private static final String CONFERENCES_URL = "http://localhost:8080/api/conferences";
    private final RestTemplate restTemplate = new RestTemplate();
    private final DefaultTableModel tableModel = new DefaultTableModel();
    private Map<Long, String> conferenceCache = new HashMap<>();

    public SectionModule() {
        initializeUI();
        loadConferencesCache();
        loadSections();
    }

    private void initializeUI() {
        setLayout(new BorderLayout());
        initTable();
        initToolbar();
    }

    private void initTable() {
        tableModel.addColumn("ID");
        tableModel.addColumn("Name");
        tableModel.addColumn("Start Time");
        tableModel.addColumn("End Time");
        tableModel.addColumn("Conference");

        JTable table = new JTable(tableModel);
        table.setAutoCreateRowSorter(true);
        add(new JScrollPane(table), BorderLayout.CENTER);
    }

    private void initToolbar() {
        JToolBar toolBar = new JToolBar();

        toolBar.add(createButton("Refresh", this::loadSections));
        toolBar.add(createButton("Add", this::showAddDialog));
        toolBar.add(createButton("Delete", this::deleteSection));
        toolBar.add(createButton("Details", this::showDetailsDialog));

        add(toolBar, BorderLayout.NORTH);
    }

    private JButton createButton(String text, Runnable action) {
        JButton button = new JButton(text);
        button.addActionListener((ActionEvent e) -> action.run());
        return button;
    }

    private void loadSections() {
        SwingWorker<Section[], Void> worker = new SwingWorker<>() {
            @Override
            protected Section[] doInBackground() {
                return restTemplate.getForObject(SECTIONS_URL, Section[].class);
            }

            @Override
            protected void done() {
                try {
                    tableModel.setRowCount(0);
                    for (Section section : get()) {
                        String conferenceInfo = "No Conference";
                        if (section.getConference() != null) {
                            conferenceInfo = conferenceCache.getOrDefault(
                                    section.getConference().getConferenceId(),
                                    "Unknown Conference"
                            );
                        }
                        tableModel.addRow(new Object[]{
                                section.getId(),
                                section.getName(),
                                section.getStartTime(),
                                section.getEndTime(),
                                conferenceInfo
                        });
                    }
                } catch (Exception ex) {
                    showError("Error loading sections: " + ex.getMessage());
                }
            }
        };
        worker.execute();
    }

    private void loadConferencesCache() {
        Conference[] conferences = restTemplate.getForObject(CONFERENCES_URL, Conference[].class);
        conferenceCache.clear();
        if (conferences != null) {
            for (Conference conf : conferences) {
                conferenceCache.put(
                        conf.getConferenceId(),
                        conf.getConferenceId() + ": " + conf.getName()
                );
            }
        }
    }

    private void showAddDialog() {
        JDialog dialog = new JDialog((Frame) null, "New Section", true);
        dialog.setLayout(new GridLayout(0, 2, 5, 5));

        JTextField nameField = new JTextField();
        JTextField startTimeField = new JTextField();
        JTextField endTimeField = new JTextField();
        JComboBox<String> conferenceCombo = new JComboBox<>(
                conferenceCache.values().toArray(new String[0])
        );

        dialog.add(new JLabel("Name:"));
        dialog.add(nameField);
        dialog.add(new JLabel("Start Time (HH:mm):"));
        dialog.add(startTimeField);
        dialog.add(new JLabel("End Time (HH:mm):"));
        dialog.add(endTimeField);
        dialog.add(new JLabel("Conference:"));
        dialog.add(conferenceCombo);

        JButton submit = new JButton("Save");
        submit.addActionListener(e -> {
            try {
                Section section = new Section();
                section.setName(nameField.getText());
                section.setStartTime(LocalTime.parse(startTimeField.getText()));
                section.setEndTime(LocalTime.parse(endTimeField.getText()));

                String selectedConference = (String) conferenceCombo.getSelectedItem();
                Long conferenceId = Long.parseLong(selectedConference.split(":")[0]);
                Conference conference = restTemplate.getForObject(
                        CONFERENCES_URL + "/" + conferenceId, Conference.class
                );
                if (conference == null) {
                    showError("Selected conference not found!");
                    return;
                }
                section.setConference(conference);

                restTemplate.postForObject(SECTIONS_URL, section, Section.class);
                loadConferencesCache();
                loadSections();
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

    private void deleteSection() {
        JScrollPane scroll = (JScrollPane) getComponent(0);
        JTable table = (JTable) scroll.getViewport().getView();

        int selectedRow = table.getSelectedRow();
        if (selectedRow == -1) {
            showError("Please select a section first");
            return;
        }

        int modelRow = table.convertRowIndexToModel(selectedRow);
        Long id = (Long) tableModel.getValueAt(modelRow, 0);

        restTemplate.delete(SECTIONS_URL + "/" + id);
        loadSections();
    }

    private void showDetailsDialog() {
        JScrollPane scroll = (JScrollPane) getComponent(0);
        JTable table = (JTable) scroll.getViewport().getView();

        int viewRow = table.getSelectedRow();
        if (viewRow == -1) {
            showError("Please select a section first");
            return;
        }

        int modelRow = table.convertRowIndexToModel(viewRow);
        Long id = (Long) tableModel.getValueAt(modelRow, 0);

        Section section = restTemplate.getForObject(SECTIONS_URL + "/" + id, Section.class);
        if (section == null) {
            showError("Section not found or could not be loaded.");
            return;
        }

        JOptionPane.showMessageDialog(
                this,
                "Section Details:\n\n" +
                        "ID: " + section.getId() + "\n" +
                        "Name: " + section.getName() + "\n" +
                        "Start Time: " + section.getStartTime() + "\n" +
                        "End Time: " + section.getEndTime() + "\n" +
                        "Conference: " + section.getConference().getName(),
                "Section Details",
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