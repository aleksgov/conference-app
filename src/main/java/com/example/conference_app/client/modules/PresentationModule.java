package com.example.conference_app.client.modules;
import com.example.conference_app.server.model.Article;
import com.example.conference_app.server.model.Presentation;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public class PresentationModule extends BaseModule<Presentation> {
    private final Map<Long, String> articleCache = new HashMap<>();

    public PresentationModule() {
        super("http://localhost:8080/api/presentations");
        loadArticlesCache();
        loadAll();
    }

    private void loadArticlesCache() {
        articleCache.clear();
        Article[] arr = rest.getForObject("http://localhost:8080/api/articles", Article[].class);
        if (arr != null) {
            for (Article a : arr) {
                articleCache.put(
                        a.getId(),
                        a.getId() + ": " + a.getName()
                );
            }
        }
    }

    @Override
    protected Class<Presentation[]> entityArrayType() {
        return Presentation[].class;
    }

    @Override
    protected Class<Presentation> entityType() {
        return Presentation.class;
    }

    @Override
    protected void configureColumns(DefaultTableModel m) {
        m.addColumn("ID");
        m.addColumn("Name");
        m.addColumn("Authors");
        m.addColumn("Article");
    }

    @Override
    protected Object[] toRow(Presentation p) {
        String art = p.getArticle() != null
                ? articleCache.getOrDefault(p.getArticle().getId(), "Unknown")
                : "—";
        return new Object[]{
                p.getId(),
                p.getName(),
                p.getAuthors(),
                art
        };
    }

    @Override
    protected String detailsText(Presentation p) {
        String artName = p.getArticle() != null ? p.getArticle().getName() : "None";
        return  "ID: " + p.getId()     + "\n" +
                "Name: " + p.getName()   + "\n" +
                "Authors: " + p.getAuthors()+ "\n" +
                "Article: " + artName;
    }

    @Override
    protected void showAddDialog() {
        JDialog dlg = new JDialog((Frame)null, "New Presentation", true);
        dlg.setLayout(new GridLayout(0,2,5,5));

        JTextField nameF = new JTextField();
        JTextField authorsF = new JTextField();
        JComboBox<String> combo = new JComboBox<>(
                articleCache.values().toArray(new String[0])
        );

        dlg.add(new JLabel("Name:")); dlg.add(nameF);
        dlg.add(new JLabel("Authors:")); dlg.add(authorsF);
        dlg.add(new JLabel("Article:")); dlg.add(combo);

        JButton save = new JButton("Save");
        save.addActionListener(e -> {
            try {
                Presentation p = new Presentation();
                p.setName(nameF.getText());
                p.setAuthors(authorsF.getText());

                String sel = (String) combo.getSelectedItem();
                if (sel == null || !sel.contains(":")) {
                    showError("Please select an article");
                    return;
                }
                Long aid = Long.parseLong(sel.split(":")[0]);
                Article a = rest.getForObject(
                        "http://localhost:8080/api/articles/" + aid,
                        Article.class
                );
                p.setArticle(a);

                rest.postForObject(getBaseUrl(), p, Presentation.class);
                dlg.dispose();
                loadArticlesCache();
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
            Presentation orig = rest.getForObject(getBaseUrl() + "/" + id, Presentation.class);
            if (orig == null) {
                showError("Not found");
                return;
            }

            JDialog dlg = new JDialog((Frame)null, "Edit Presentation", true);
            dlg.setLayout(new GridLayout(0,2,5,5));

            JTextField nameF    = new JTextField(orig.getName());
            JTextField authorsF = new JTextField(orig.getAuthors());
            JComboBox<String> combo = new JComboBox<>(
                    articleCache.values().toArray(new String[0])
            );
            if (orig.getArticle() != null) {
                combo.setSelectedItem(articleCache.get(orig.getArticle().getId()));
            }

            dlg.add(new JLabel("Name:")); dlg.add(nameF);
            dlg.add(new JLabel("Authors:")); dlg.add(authorsF);
            dlg.add(new JLabel("Article:")); dlg.add(combo);

            JButton save = new JButton("Save");
            save.addActionListener(ev -> {
                try {
                    orig.setName(nameF.getText());
                    orig.setAuthors(authorsF.getText());

                    String sel = (String) combo.getSelectedItem();
                    Long aid = Long.parseLong(sel.split(":")[0]);
                    Article a = rest.getForObject(
                            "http://localhost:8080/api/articles/" + aid,
                            Article.class
                    );
                    orig.setArticle(a);

                    rest.put(getBaseUrl() + "/" + id, orig);
                    dlg.dispose();
                    loadArticlesCache();
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
        return "http://localhost:8080/api/presentations";
    }
}
