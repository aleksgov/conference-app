package com.example.conference_app.client.modules;

import com.example.conference_app.server.model.Conference;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.time.LocalDate;

public class ConferenceModule extends BaseModule<Conference> {

    public ConferenceModule() {
        super("http://localhost:8080/api/conferences");
    }

    @Override
    protected Class<Conference[]> entityArrayType() {
        return Conference[].class;
    }

    @Override
    protected Class<Conference> entityType() {
        return Conference.class;
    }

    @Override
    protected void configureColumns(DefaultTableModel m) {
        m.addColumn("ID");
        m.addColumn("Name");
        m.addColumn("Start Date");
        m.addColumn("End Date");
    }

    @Override
    protected Object[] toRow(Conference c) {
        return new Object[]{
                c.getConferenceId(),
                c.getName(),
                c.getStartDate(),
                c.getEndDate()
        };
    }

    @Override
    protected String detailsText(Conference c) {
        return  "ID: " + c.getConferenceId() + "\n" +
                "Name: " + c.getName() + "\n" +
                "Start: " + c.getStartDate() + "\n" +
                "End: " + c.getEndDate();
    }

    @Override
    protected void showAddDialog() {
        JDialog dlg = new JDialog((Frame)null, "New Conference", true);
        dlg.setLayout(new GridLayout(0,2,5,5));

        JTextField nameF = new JTextField();
        JTextField startF = new JTextField();
        JTextField endF   = new JTextField();

        dlg.add(new JLabel("Name:"));        dlg.add(nameF);
        dlg.add(new JLabel("Start (YYYY-MM-DD):")); dlg.add(startF);
        dlg.add(new JLabel("End (YYYY-MM-DD):")); dlg.add(endF);

        JButton save = new JButton("Save");
        save.addActionListener(e -> {
            try {
                Conference c = new Conference();
                c.setName(nameF.getText());
                c.setStartDate(LocalDate.parse(startF.getText()));
                c.setEndDate(LocalDate.parse(endF.getText()));
                rest.postForObject(getBaseUrl(), c, Conference.class);
                dlg.dispose();
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

    private String getBaseUrl() {
        return "http://localhost:8080/api/conferences";
    }
}
