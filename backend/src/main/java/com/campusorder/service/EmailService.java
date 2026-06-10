package com.campusorder.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Value("${sendgrid.from-name}")
    private String fromName;

    public void sendVerificationCode(String to, String code) {

        Email from = new Email(fromEmail, fromName);
        Email recipient = new Email(to);

        String subject = "Verificación de correo - CofiGO";

        Content content = new Content(
                "text/plain",
                "Hola,\n\n" +
                "Tu código de verificación para CofiGO es:\n\n" +
                code +
                "\n\n" +
                "Este código expira en 10 minutos.\n\n" +
                "Equipo CofiGO"
        );

        Mail mail = new Mail(from, subject, recipient, content);

        Request request = new Request();

        try {
            SendGrid sg = new SendGrid(apiKey);

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new RuntimeException(
                        "Error SendGrid: "
                                + response.getStatusCode()
                                + " - "
                                + response.getBody()
                );
            }

        } catch (Exception e) {
            throw new RuntimeException("Error enviando correo: " + e.getMessage(), e);
        }
    }
}