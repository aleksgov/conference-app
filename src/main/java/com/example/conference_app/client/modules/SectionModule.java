package com.example.conference_app.client.modules;

import com.example.conference_app.server.model.Conference;
import com.example.conference_app.server.model.Section;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

public class SectionModule extends BaseModule<Section> {
    private final Map<Long, String> conferenceCache = new HashMap<>();

    public SectionModule() {
        super("http://localhost:8080/api/sections");
        loadConferencesCache();
        loadAll();
    }

    private void loadConferencesCache() {
        conferenceCache.clear();
        Conference[] arr = rest.getForObject(getConferenceUrl(), Conference[].class);
        if (arr!=null) {
            for (Conference c : arr) {
                conferenceCache.put(c.getConferenceId(),
                        c.getConferenceId() + ": " + c.getName());
            }
        }
    }

    @Override
    protected Class<Section[]> entityArrayType() {
        return Section[].class;
    }

    @Override
    protected Class<Section> entityType() {
        return Section.class;
    }

    @Override
    protected void configureColumns(DefaultTableModel m) {
        m.addColumn("ID");
        m.addColumn("Name");
        m.addColumn("Start Time");
        m.addColumn("End Time");
        m.addColumn("Conference");
    }

    @Override
    protected Object[] toRow(Section s) {
        String conf = (s.getConference() != null)
                ? conferenceCache.getOrDefault(s.getConference().getConferenceId(), "Unknown")
                : "—";
        return new Object[]{
                s.getId(), s.getName(),
                s.getStartTime(), s.getEndTime(),
                conf
        };
    }

    @Override
    protected String detailsText(Section s) {
        String confName = (s.getConference()!=null) ? s.getConference().getName() : "None";
        return  "ID: " + s.getId() + "\n" +
                "Name: " + s.getName() + "\n" +
                "Start time: " + s.getStartTime() + "\n" +
                "End time: " + s.getEndTime()   + "\n" +
                "Conference: " + confName;
    }

    @Override
    protected void showAddDialog() {
        JDialog dlg = new JDialog((Frame)null, "New Section", true);
        dlg.setLayout(new GridLayout(0,2,5,5));

        JTextField nameF = new JTextField();
        JTextField startF = new JTextField();
        JTextField endF   = new JTextField();

        JComboBox<String> combo = new JComboBox<>(
                conferenceCache.values().toArray(new String[0])
        );

        dlg.add(new JLabel("Name:"));       dlg.add(nameF);
        dlg.add(new JLabel("Start (HH:mm):")); dlg.add(startF);
        dlg.add(new JLabel("End (HH:mm):")); dlg.add(endF);
        dlg.add(new JLabel("Conference:")); dlg.add(combo);

        JButton save = new JButton("Save");
        save.addActionListener(e -> {
            try {
                Section s = new Section();
                s.setName(nameF.getText());
                s.setStartTime(LocalTime.parse(startF.getText()));
                s.setEndTime(LocalTime.parse(endF.getText()));
                String sel = (String) combo.getSelectedItem();
                if (sel == null || !sel.contains(":")) {
                    showError("Incorrect conference selection");
                    return;
                }
                Long cid = Long.parseLong(sel.split(":")[0]);
                Conference c = rest.getForObject(getConferenceUrl() + "/" + cid, Conference.class);
                s.setConference(c);

                rest.postForObject(getBaseUrl(), s, Section.class);
                dlg.dispose();
                loadConferencesCache();
                loadAll();
            } catch (Exception ex) {
                showError("Bad data: " + ex.getMessage());
            }
        });
        dlg.add(save);

        JButton cancel = new JButton("Cancel");
        cancel.addActionListener(e -> dlg.dispose());
        dlg.add(cancel);

        dlg.pack();
        dlg.setLocationRelativeTo(this);
        dlg.setVisible(true);
    }

    @Override protected void showEditDialog() {
        try {
            Long id = getSelectedId();
            Section orig = rest.getForObject(getBaseUrl() + "/" + id, Section.class);
            if (orig == null) {
                showError("Not found");
                return;
            }

            JDialog dlg = new JDialog((Frame)null, "Edit Section", true);
            dlg.setLayout(new GridLayout(0,2,5,5));

            JTextField nameF = new JTextField(orig.getName());
            JTextField startF = new JTextField(orig.getStartTime().toString());
            JTextField endF   = new JTextField(orig.getEndTime().toString());
            JComboBox<String> combo = new JComboBox<>(
                    conferenceCache.values().toArray(new String[0])
            );
            // выставляем выбранный
            if (orig.getConference() != null) {
                String key = conferenceCache.get(orig.getConference().getConferenceId());
                combo.setSelectedItem(key);
            }

            dlg.add(new JLabel("Name:"));       dlg.add(nameF);
            dlg.add(new JLabel("Start (HH:mm):")); dlg.add(startF);
            dlg.add(new JLabel("End (HH:mm):")); dlg.add(endF);
            dlg.add(new JLabel("Conference:")); dlg.add(combo);

            JButton save = new JButton("Save");
            save.addActionListener(ev -> {
                try {
                    orig.setName(nameF.getText());
                    orig.setStartTime(LocalTime.parse(startF.getText()));
                    orig.setEndTime(LocalTime.parse(endF.getText()));
                    Object selObj = combo.getSelectedItem();
                    if (selObj == null) {
                        showError("Please select a conference");
                        return;
                    }
                    String sel = selObj.toString();
                    Long cid = Long.parseLong(sel.split(":")[0]);
                    Conference c = rest.getForObject(getConferenceUrl() + "/" + cid, Conference.class);
                    orig.setConference(c);

                    rest.put(getBaseUrl() + "/" + id, orig);
                    dlg.dispose();
                    loadConferencesCache();
                    loadAll();
                } catch (Exception ex) {
                    showError("Bad data: " + ex.getMessage());
                }
            });
            dlg.add(save);

            JButton cancel = new JButton("Cancel");
            cancel.addActionListener(ev -> dlg.dispose());
            dlg.add(cancel);

            dlg.pack();
            dlg.setLocationRelativeTo(this);
            dlg.setVisible(true);

        } catch (RuntimeException ex) {
            showError(ex.getMessage());
        }
    }

    private String getBaseUrl() {
        return "http://localhost:8080/api/sections";
    }

    private String getConferenceUrl() {
        return "http://localhost:8080/api/conferences";
    }
}