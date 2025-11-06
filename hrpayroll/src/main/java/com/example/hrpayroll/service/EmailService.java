package com.example.hrpayroll.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@hrpayroll.com}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    public void sendVerificationEmail(String toEmail, String verificationCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verificação de Email - PagueAqui");
            message.setText(
                "Olá!\n\n" +
                "Seu código de verificação é: " + verificationCode + "\n\n" +
                "Este código expira em 24 horas.\n\n" +
                "Se você não solicitou este código, ignore este email.\n\n" +
                "Atenciosamente,\n" +
                "Equipe PagueAqui"
            );
            
            mailSender.send(message);
            log.info("Email de verificação enviado para: {}", toEmail);
        } catch (Exception e) {
            log.error("Erro ao enviar email de verificação para: {}", toEmail, e);
            throw new RuntimeException("Erro ao enviar email de verificação");
        }
    }
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Recuperação de Senha - PagueAqui");
            
            String resetLink = frontendUrl + "/auth/hr/new-password?token=" + resetToken;
            
            message.setText(
                "Olá!\n\n" +
                "Você solicitou a recuperação de senha.\n\n" +
                "Clique no link abaixo para redefinir sua senha:\n" +
                resetLink + "\n\n" +
                "Este link expira em 1 hora.\n\n" +
                "Se você não solicitou a recuperação de senha, ignore este email.\n\n" +
                "Atenciosamente,\n" +
                "Equipe PagueAqui"
            );
            
            mailSender.send(message);
            log.info("Email de recuperação de senha enviado para: {}", toEmail);
        } catch (Exception e) {
            log.error("Erro ao enviar email de recuperação de senha para: {}", toEmail, e);
            throw new RuntimeException("Erro ao enviar email de recuperação de senha");
        }
    }

    public void sendInviteEmail(String toEmail, String userName, String companyName, String tempPassword) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Convite - Acesso ao Portal PagueAqui");

            String loginLink = frontendUrl + "/auth/login";

            StringBuilder body = new StringBuilder();
            body.append("Olá");
            if (userName != null && !userName.isBlank()) {
                body.append(", ").append(userName);
            }
            body.append("!\n\n");
            body.append("Você foi convidado(a)");
            if (companyName != null && !companyName.isBlank()) {
                body.append(" pela ").append(companyName);
            }
            body.append(" para acessar o portal da PagueAqui.\n\n");
            if (tempPassword != null && !tempPassword.isBlank()) {
                body.append("Sua senha temporária é: ").append(tempPassword).append("\n\n");
            }
            body.append("Acesse o portal pelo link abaixo e realize o login:").append("\n");
            body.append(loginLink).append("\n\n");
            body.append("Recomendamos alterar sua senha no primeiro acesso.\n\n");
            body.append("Se você não esperava este convite, ignore este email.\n\n");
            body.append("Atenciosamente,\nEquipe PagueAqui");

            message.setText(body.toString());

            mailSender.send(message);
            log.info("Email de convite enviado para: {}", toEmail);
        } catch (Exception e) {
            log.error("Erro ao enviar email de convite para: {}", toEmail, e);
            throw new RuntimeException("Erro ao enviar email de convite");
        }
    }
}