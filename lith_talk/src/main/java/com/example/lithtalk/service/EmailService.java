package com.example.lithtalk.service;

import com.example.lithtalk.entity.User;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRegistrationEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(user.getEmail());
        message.setSubject("Welcome to Lith&Talk!");
        message.setText("Welcome, " + user.getFirstName() + "!\n\n" +
                "You have successfully registered to Lith&Talk.\n" +
                "We’re happy to have you on board! 💙");

        mailSender.send(message);
    }
    public void sendResetPasswordEmail(String email, String link) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Lith&Talk Password Reset");
        message.setText("You requested a password reset.\n\n" +
                "Click the link below to reset your password:\n" +
                link + "\n\n" +
                "If you didn’t request this, you can ignore this email.");

        mailSender.send(message);
    }

    public void sendPasswordChangedEmail(String email) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Lith&Talk Password Change");
        message.setText("Hello! Your password has been successfully changed. " +
                "If this wasn't you, please contact support immediately.");

        mailSender.send(message);
    }

    public void sendAccountDeletionEmail(String email){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Lith&Talk Account Deletion");
        message.setText("Hello! Your account has been successfully deleted. " +
                "If this wasn't you, please contact support immediately.");

        mailSender.send(message);
    }

}
