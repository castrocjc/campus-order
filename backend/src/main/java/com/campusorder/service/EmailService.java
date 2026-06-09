package com.campusorder.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendVerificationCode(String to, String code) {
        System.out.println("Código de verificación para " + to + ": " + code);
    }
}