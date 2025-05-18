package com.example.conference_app.client.components;

import com.example.conference_app.server.dto.LoginRequest;
import com.example.conference_app.server.dto.LoginResponse;
import com.example.conference_app.server.dto.RegistrationRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import javax.swing.*;
import java.awt.*;
import java.util.concurrent.ExecutionException;
import lombok.Getter;

@Getter
public class LoginDialog extends JDialog {
    private final JTextField emailField = new JTextField(20);
    private final JPasswordField passwordField = new JPasswordField(20);
    private boolean isLoggedIn = false;
    private String userRole;
    private final RestTemplate restTemplate;

    public LoginDialog(Frame owner) {
        super(owner, "Login", true);
        restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
        setLayout(new GridLayout(3, 2, 5, 5));
        initComponents();
        pack();
        setLocationRelativeTo(owner);
    }

    private void initComponents() {
        add(new JLabel("Email:"));
        add(emailField);
        add(new JLabel("Password:"));
        add(passwordField);

        JButton loginBtn = new JButton("Login");
        loginBtn.addActionListener(e -> attemptLogin());
        add(loginBtn);

        JButton registerBtn = new JButton("Register");
        registerBtn.addActionListener(e -> showRegistrationDialog());
        add(registerBtn);
    }

    private void attemptLogin() {
        String email = emailField.getText().trim();
        String password = new String(passwordField.getPassword());

        if (email.isEmpty() || password.isEmpty()) {
            showError("Заполните все поля!");
            return;
        }

        new SwingWorker<LoginResponse, Void>() {
            @Override
            protected LoginResponse doInBackground() {
                try {
                    ResponseEntity<LoginResponse> response = restTemplate.postForEntity(
                            "http://localhost:8080/api/auth/login",
                            new LoginRequest(email, password),
                            LoginResponse.class
                    );
                    return response.getBody();
                } catch (HttpClientErrorException e) {
                    showError(e.getResponseBodyAsString());
                    return null;
                }
            }

            @Override
            protected void done() {
                try {
                    LoginResponse response = get();
                    if (response != null) {
                        isLoggedIn = true;
                        userRole = response.getRole();
                        dispose();
                    }
                } catch (InterruptedException | ExecutionException e) {
                    showError("Ошибка соединения: " + e.getMessage());
                }
            }
        }.execute();
    }


    private void showRegistrationDialog() {
        JDialog regDialog = new JDialog(this, "Регистрация", true);
        regDialog.setLayout(new GridLayout(0, 2, 5, 5));

        JTextField regEmail = new JTextField(20);
        JPasswordField regPass = new JPasswordField(20);
        JPasswordField regPassConfirm = new JPasswordField(20);

        regDialog.add(new JLabel("Email:"));
        regDialog.add(regEmail);
        regDialog.add(new JLabel("Пароль:"));
        regDialog.add(regPass);
        regDialog.add(new JLabel("Подтвердите пароль:"));
        regDialog.add(regPassConfirm);

        JButton regBtn = new JButton("Зарегистрироваться");
        regBtn.addActionListener(e -> {
            String email = regEmail.getText().trim();
            String pass = new String(regPass.getPassword());
            String passConfirm = new String(regPassConfirm.getPassword());

            if (!pass.equals(passConfirm)) {
                showError("Пароли не совпадают!", regDialog);
                return;
            }

            new SwingWorker<LoginResponse, Void>() {
                @Override
                protected LoginResponse doInBackground() {
                    try {
                        return restTemplate.postForObject(
                                "http://localhost:8080/api/auth/register",
                                new RegistrationRequest(email, pass),
                                LoginResponse.class
                        );
                    } catch (HttpClientErrorException ex) {
                        showError(ex.getResponseBodyAsString(), regDialog);
                        return null;
                    }
                }

                @Override
                protected void done() {
                    try {
                        if (get() != null) {
                            JOptionPane.showMessageDialog(regDialog,
                                    "Регистрация успешна!",
                                    "Успех", JOptionPane.INFORMATION_MESSAGE);
                            regDialog.dispose();
                        }
                    } catch (InterruptedException | ExecutionException e) {
                        showError("Ошибка соединения: " + e.getMessage(), regDialog);
                    }
                }
            }.execute();
        });

        regDialog.add(regBtn);
        regDialog.pack();
        regDialog.setLocationRelativeTo(this);
        regDialog.setVisible(true);
    }

    private void showError(String message) {
        JOptionPane.showMessageDialog(this, message, "Ошибка", JOptionPane.ERROR_MESSAGE);
    }

    private void showError(String message, JDialog parent) {
        JOptionPane.showMessageDialog(parent, message, "Ошибка", JOptionPane.ERROR_MESSAGE);
    }

    public boolean isLoggedIn() {
        return isLoggedIn;
    }
}