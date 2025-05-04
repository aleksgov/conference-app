package com.example.conference_app.client.modules;
import com.example.conference_app.server.model.Participant;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

public class ParticipantModule extends BaseModule<Participant> {

    public ParticipantModule() {
        super("http://localhost:8080/api/participants");
        loadAll();
    }

    @Override
    protected Class<Participant[]> entityArrayType() {
        return Participant[].class;
    }

    @Override
    protected Class<Participant> entityType() {
        return Participant.class;
    }

    @Override
    protected void configureColumns(DefaultTableModel m) {
        m.addColumn("ID");
        m.addColumn("Full Name");
        m.addColumn("Organization");
    }

    @Override
    protected Object[] toRow(Participant p) {
        return new Object[]{
                p.getId(),
                p.getFullName(),
                p.getOrganization()
        };
    }

    @Override
    protected String detailsText(Participant p) {
        return  "ID: " + p.getId()          + "\n" +
                "Full Name: " + p.getFullName()   + "\n" +
                "Organization: " + p.getOrganization();
    }

    @Override
    protected void showAddDialog() {
        JDialog dlg = new JDialog((Frame)null, "New Participant", true);
        dlg.setLayout(new GridLayout(0,2,5,5));

        JTextField nameF = new JTextField();
        JTextField orgF = new JTextField();

        dlg.add(new JLabel("Full Name:")); dlg.add(nameF);
        dlg.add(new JLabel("Organization:")); dlg.add(orgF);

        JButton save = new JButton("Save");
        save.addActionListener(e -> {
            try {
                Participant p = new Participant();
                p.setFullName(nameF.getText());
                p.setOrganization(orgF.getText());

                rest.postForObject(getBaseUrl(), p, Participant.class);
                dlg.dispose();
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
    }

    @Override
    protected void showEditDialog() {
        try {
            Long id = getSelectedId();
            Participant orig = rest.getForObject(getBaseUrl() + "/" + id, Participant.class);
            if (orig == null) {
                showError("Not found");
                return;
            }

            JDialog dlg = new JDialog((Frame)null, "Edit Participant", true);
            dlg.setLayout(new GridLayout(0,2,5,5));

            JTextField nameF = new JTextField(orig.getFullName());
            JTextField orgF  = new JTextField(orig.getOrganization());

            dlg.add(new JLabel("Full Name:")); dlg.add(nameF);
            dlg.add(new JLabel("Organization:")); dlg.add(orgF);

            JButton save = new JButton("Save");
            save.addActionListener(ev -> {
                try {
                    orig.setFullName(nameF.getText());
                    orig.setOrganization(orgF.getText());
                    rest.put(getBaseUrl() + "/" + id, orig);
                    dlg.dispose();
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
        return "http://localhost:8080/api/participants";
    }
}
