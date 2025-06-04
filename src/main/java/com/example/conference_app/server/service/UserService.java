package com.example.conference_app.server.service;

import com.example.conference_app.server.model.User;
import com.example.conference_app.server.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!BCrypt.checkpw(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User register(String email, String password, String fullName, LocalDate dateOfBirth, String phone, User.Gender gender) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt()));
        user.setRole(User.Role.USER);
        user.setFullName(fullName);
        user.setDateOfBirth(dateOfBirth);
        user.setPhone(phone);
        user.setGender(gender != null ? gender : User.Gender.UNSPECIFIED);
        return userRepository.save(user);
    }
}