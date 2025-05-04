package com.example.conference_app.client.modules;

import com.example.conference_app.server.model.Article;
import com.example.conference_app.server.model.Section;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public class ArticleModule extends BaseModule<Article> {
    private final Map<Long, String> sectionCache = new HashMap<>();

    public ArticleModule() {
        super("http://localhost:8080/api/articles");
        loadSectionsCache();
        loadAll();
    }

    private void loadSectionsCache() {
        sectionCache.clear();
        Section[] arr = rest.getForObject(getSectionUrl(), Section[].class);
        if (arr != null) {
            for (Section s : arr) {
                sectionCache.put(
                        s.getId(),
                        s.getId() + ": " + s.getName()
                );
            }
        }
    }

    @Override
    protected Class<Article[]> entityArrayType() {
        return Article[].class;
    }
    @Override
    protected Class<Article> entityType() {
        return Article.class;
    }

    @Override
    protected void configureColumns(DefaultTableModel m) {
        m.addColumn("ID");
        m.addColumn("Name");
        m.addColumn("Pages");
        m.addColumn("Authors");
        m.addColumn("Section");
    }

    @Override
    protected Object[] toRow(Article art) {
        String sec = art.getSection() != null
                ? sectionCache.getOrDefault(art.getSection().getId(), "Unknown")
                : "—";
        return new Object[]{
                art.getId(),
                art.getName(),
                art.getPages(),
                art.getAuthors(),
                sec
        };
    }

    @Override
    protected String detailsText(Article art) {
        String secName = art.getSection() != null ? art.getSection().getName() : "None";
        return
            "ID: " + art.getId() + "\n" +
            "Name: " + art.getName() + "\n" +
            "Pages: " + art.getPages() + "\n" +
            "Authors: " + art.getAuthors() + "\n" +
            "Section: " + secName;
    }

    @Override
    protected void showAddDialog() {
        JDialog dlg = new JDialog((Frame)null, "New Article", true);
        dlg.setLayout(new GridLayout(0,2,5,5));

        JTextField nameF = new JTextField();
        JTextField pagesF = new JTextField();
        JTextField authorsF = new JTextField();
        JComboBox<String> combo = new JComboBox<>(
                sectionCache.values().toArray(new String[0])
        );

        dlg.add(new JLabel("Name:")); dlg.add(nameF);
        dlg.add(new JLabel("Pages:")); dlg.add(pagesF);
        dlg.add(new JLabel("Authors:")); dlg.add(authorsF);
        dlg.add(new JLabel("Section:")); dlg.add(combo);

        JButton save = new JButton("Save");
        save.addActionListener(e -> {
            try {
                Article art = new Article();
                art.setName(nameF.getText());
                art.setPages(Integer.parseInt(pagesF.getText()));
                art.setAuthors(authorsF.getText());

                String sel = (String) combo.getSelectedItem();
                if (sel == null || !sel.contains(":")) {
                    showError("Please select a section");
                    return;
                }
                Long sid = Long.parseLong(sel.split(":")[0]);
                Section sec = rest.getForObject(getSectionUrl() + "/" + sid, Section.class);
                art.setSection(sec);

                rest.postForObject(getBaseUrl(), art, Article.class);
                dlg.dispose();
                loadSectionsCache();
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
            Article orig = rest.getForObject(getBaseUrl() + "/" + id, Article.class);
            if (orig == null) {
                showError("Not found");
                return;
            }

            JDialog dlg = new JDialog((Frame)null, "Edit Article", true);
            dlg.setLayout(new GridLayout(0,2,5,5));

            JTextField nameF = new JTextField(orig.getName());
            JTextField pagesF = new JTextField(String.valueOf(orig.getPages()));
            JTextField authorsF = new JTextField(orig.getAuthors());
            JComboBox<String> combo = new JComboBox<>(
                    sectionCache.values().toArray(new String[0])
            );
            if (orig.getSection() != null) {
                String key = sectionCache.get(orig.getSection().getId());
                combo.setSelectedItem(key);
            }

            dlg.add(new JLabel("Name:"));      dlg.add(nameF);
            dlg.add(new JLabel("Pages:"));     dlg.add(pagesF);
            dlg.add(new JLabel("Authors:"));   dlg.add(authorsF);
            dlg.add(new JLabel("Section:"));   dlg.add(combo);

            JButton save = new JButton("Save");
            save.addActionListener(ev -> {
                try {
                    orig.setName(nameF.getText());
                    orig.setPages(Integer.parseInt(pagesF.getText()));
                    orig.setAuthors(authorsF.getText());

                    String sel = (String) combo.getSelectedItem();
                    Long sid = Long.parseLong(sel.split(":")[0]);
                    Section sec = rest.getForObject(getSectionUrl() + "/" + sid, Section.class);
                    orig.setSection(sec);

                    rest.put(getBaseUrl() + "/" + id, orig);
                    dlg.dispose();
                    loadSectionsCache();
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
        return "http://localhost:8080/api/articles";
    }

    private String getSectionUrl() {
        return "http://localhost:8080/api/sections";
    }
}
