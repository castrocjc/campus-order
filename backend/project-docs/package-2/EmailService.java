package com.campusorder.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
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

    @Value("${sendgrid.test-bcc-email:}")
    private String testBccEmail;    

    public void sendVerificationCode(String to, String code) {

        Email from = new Email(fromEmail, fromName);
        Email recipient = new Email(to);

        String subject = "Tu código de verificación de CofiGO";

        Content content = new Content(
            "text/html",
            """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e5e5;">

                <h2 style="color: #f57c00; text-align: center;">
                    ☕ CofiGO
                </h2>

                <p>Hola,</p>

                <p>Gracias por registrarte en CofiGO.</p>

                <p>Tu código de verificación es:</p>

                <div style="
                    text-align:center;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:6px;
                    color:#f57c00;
                    padding:20px;
                    margin:20px 0;
                    background:#fff3e0;
                    border-radius:10px;">
                    %s
                </div>

                <p>Este código expira en <strong>10 minutos</strong>.</p>

                <p>Si no solicitaste este registro, puedes ignorar este correo.</p>

                <hr>

                <p style="font-size:12px;color:#777;">
                    Equipo CofiGO
                </p>

                </div>
            </body>
            </html>
            """.formatted(code)
        );

        Content plainTextContent = new Content(
            "text/plain",
            "Tu código de verificación de CofiGO es: "
                + code
                + ". Este código expira en 10 minutos."
        );

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setSubject(subject);

        Personalization personalization = new Personalization();
        personalization.addTo(recipient);

        if (testBccEmail != null && !testBccEmail.isBlank()) {
            personalization.addBcc(new Email(testBccEmail));
        }

        mail.addPersonalization(personalization);

        mail.addContent(plainTextContent);
        mail.addContent(content);

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