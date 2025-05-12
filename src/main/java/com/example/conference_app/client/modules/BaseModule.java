package com.example.conference_app.client.modules;

import org.springframework.web.client.RestTemplate;

import javax.swing.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;

import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.concurrent.ExecutionException;

public abstract class BaseModule<T> extends JPanel {
    protected final RestTemplate rest = new RestTemplate();
    protected final DefaultTableModel model = new DefaultTableModel();
    protected final JTable table;
    private final String baseUrl;

    public BaseModule(String baseUrl) {
        this.baseUrl = baseUrl;
        setLayout(new BorderLayout());

        // таблица
        configureColumns(model);
        table = new JTable(model);

        // отключение сетки
        table.setShowGrid(false);
        table.setIntercellSpacing(new Dimension(0, 0));

        // полосатые строки
        table.setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(
                    JTable tbl, Object value, boolean isSelected,
                    boolean hasFocus, int row, int column) {
                super.getTableCellRendererComponent(tbl, value, isSelected, hasFocus, row, column);
                if (isSelected) {
                    setBackground(tbl.getSelectionBackground());
                    setForeground(tbl.getSelectionForeground());
                } else {
                    // четные строки – белые, нечётные - серые
                    setBackground(row % 2 == 0 ? Color.WHITE : new Color(245, 245, 245));
                    setForeground(Color.DARK_GRAY);
                }
                setBorder(noFocusBorder);
                return this;
            }
        });

        // скругление
        JTableHeader hdr = table.getTableHeader();
        hdr.setPreferredSize(new Dimension(hdr.getPreferredSize().width, 30));
        hdr.setFont(hdr.getFont().deriveFont(Font.BOLD, 14f));
        hdr.setDefaultRenderer(new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(
                    JTable tbl, Object value, boolean isSelected,
                    boolean hasFocus, int row, int column) {
                JLabel lbl = (JLabel) super.getTableCellRendererComponent(
                        tbl, value, isSelected, hasFocus, row, column);
                lbl.setHorizontalAlignment(CENTER);
                lbl.setOpaque(true);
                lbl.setBackground(new Color(239, 239, 239));
                return lbl;
            }
        });

        // высота строки, выделение, шрифт
        table.setRowHeight(28);
        table.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        table.setSelectionBackground(new Color(100, 150, 220));
        table.setSelectionForeground(Color.WHITE);

        // автосортировка столбцов
        table.setAutoCreateRowSorter(true);

        add(new JScrollPane(table), BorderLayout.CENTER);

        // тулбар
        JToolBar toolBar = new JToolBar();
        toolBar.add(createButton("Refresh", this::loadAll));
        toolBar.add(createButton("Add", this::showAddDialog));
        toolBar.add(createButton("Edit", this::showEditDialog));
        toolBar.add(createButton("Delete", this::deleteSelected));
        toolBar.add(createButton("Details", this::showDetails));
        add(toolBar, BorderLayout.NORTH);

        loadAll();
    }

    // кнопка
    private JButton createButton(String text, Runnable action) {
        JButton b = new JButton(text);
        b.addActionListener(e -> action.run());

        b.setFocusPainted(false);
        b.setBorder(BorderFactory.createEmptyBorder(6, 12, 6, 12));
        b.setContentAreaFilled(false);

        // курсор при наведении
        b.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        b.setOpaque(true);
        b.setBackground(new Color(66, 133, 244));   // основной фон
        b.setForeground(Color.BLACK);               // текст

        // эффект наведения
        b.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                b.setBackground(new Color(52, 103, 189));
            }
            @Override
            public void mouseExited(MouseEvent e) {
                b.setBackground(new Color(66, 133, 244));
            }
        });

        return b;
    }

    // загрузка списка
    protected void loadAll() {
        SwingWorker<T[], Void> worker = new SwingWorker<>() {
            @Override
            protected T[] doInBackground() {
                return rest.getForObject(baseUrl, entityArrayType());
            }
            @Override
            protected void done() {
                try {
                    model.setRowCount(0);
                    T[] arr = get();
                    if (arr != null) {
                        for (T e : arr) {
                            model.addRow(toRow(e));
                        }
                    }
                } catch (InterruptedException | ExecutionException ex) {
                    showError("Load error: " + ex.getMessage());
                }
            }
        };
        worker.execute();
    }

    // удаление
    protected void deleteSelected() {
        try {
            Long id = getSelectedId();
            rest.delete(baseUrl + "/" + id);
            loadAll();
        } catch (RuntimeException ex) {
            showError(ex.getMessage());
        }
    }

    // детали
    protected void showDetails() {
        try {
            Long id = getSelectedId();
            T obj = rest.getForObject(baseUrl + "/" + id, entityType());
            if (obj == null) {
                showError("Not found");
            } else {
                JOptionPane.showMessageDialog(
                        this,
                        detailsText(obj),
                        "Details",
                        JOptionPane.INFORMATION_MESSAGE
                );
            }
        } catch (RuntimeException ex) {
            showError(ex.getMessage());
        }
    }

    protected abstract void showEditDialog();

    // получить ID из первой колонки
    protected Long getSelectedId() {
        int vr = table.getSelectedRow();
        if (vr < 0) throw new RuntimeException("Please select a row first");
        int mr = table.convertRowIndexToModel(vr);
        Object val = model.getValueAt(mr, 0);
        if (!(val instanceof Number))
            throw new RuntimeException("Bad ID value");
        return ((Number) val).longValue();
    }

    protected void showError(String msg) {
        JOptionPane.showMessageDialog(this, msg, "Error", JOptionPane.ERROR_MESSAGE);
    }

    // то что реализует подкласс
    protected abstract Class<T[]> entityArrayType();
    protected abstract Class<T> entityType();
    protected abstract void configureColumns(DefaultTableModel m);
    protected abstract Object[] toRow(T entity);
    protected abstract String detailsText(T entity);
    protected abstract void showAddDialog();
}
