package com.example.lithtalk.service;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.lithtalk.dto.LoginRequest;
import com.example.lithtalk.dto.RegisterRequest;
import com.example.lithtalk.dto.ChangePasswordRequest;
import com.example.lithtalk.dto.ResetPasswordRequest;
import com.example.lithtalk.dto.PasswordResetEmailRequest;

import com.example.lithtalk.entity.User;
import com.example.lithtalk.entity.PasswordResetToken;

import com.example.lithtalk.repository.UserRepository;
import com.example.lithtalk.repository.PasswordResetTokenRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PasswordResetTokenRepository resetTokenRepository;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService,
                       PasswordResetTokenRepository resetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.resetTokenRepository = resetTokenRepository;
    }



    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }


    // ---------------------------
    // REGISTER
    // ---------------------------
    public void register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setLocation(request.getLocation());

        userRepository.save(user);

        emailService.sendRegistrationEmail(user);
    }

    // ---------------------------
    // LOGIN
    // ---------------------------
    public boolean login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .orElse(false);
    }


    // ---------------------------
    // CHANGE PASSWORD (in profile)
    // ---------------------------
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User email not found. Try logging in again."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        emailService.sendPasswordChangedEmail(user.getEmail());
    }



    // ---------------------------
    // REQUEST PASSWORD RESET
    // ---------------------------
    public void createPasswordResetToken(PasswordResetEmailRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email not registered"));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(user.getEmail());
        resetToken.setToken(token);
        resetToken.setExpiry(LocalDateTime.now().plusHours(1));

        resetTokenRepository.save(resetToken);

        String link = "http://localhost:3000/reset-password/" + token;
        emailService.sendResetPasswordEmail(user.getEmail(), link);
    }

    // ---------------------------
    // RESET PASSWORD USING TOKEN
    // ---------------------------
    public void resetPassword(String token, ResetPasswordRequest request) {

        PasswordResetToken resetToken = resetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        if (resetToken.getExpiry().isBefore(LocalDateTime.now())) {
            resetTokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Token expired");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetTokenRepository.delete(resetToken);
    }

    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Optional: delete related data (reviews, etc.) here if needed
        // e.g., reviewRepository.deleteByUserId(user.getId());

        userRepository.delete(user);

        // Optional: send goodbye email
        emailService.sendAccountDeletionEmail(email);
    }
}
