package com.campusorder.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationCode(String to, String code) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Verificación de correo - CofiGO");

        message.setText(
                "Hola,\n\n" +
                "Tu código de verificación para CofiGO es:\n\n" +
                code +
                "\n\n" +
                "Este código expira en 10 minutos.\n\n" +
                "Equipo CofiGO"
        );

        mailSender.send(message);
    }
}