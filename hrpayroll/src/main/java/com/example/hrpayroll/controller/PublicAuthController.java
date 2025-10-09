package com.example.hrpayroll.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hrpayroll.dto.PublicForgetPasswordDto;
import com.example.hrpayroll.dto.PublicLoginAccountDto;
import com.example.hrpayroll.dto.PublicRegisterAccountDto;
import com.example.hrpayroll.dto.PublicSendVerificationCodeDto;
import com.example.hrpayroll.dto.PublicVerifyEmailDto;
import com.example.hrpayroll.dto.response.AuthResponseDto;
import com.example.hrpayroll.dto.response.MessageResponseDto;
import com.example.hrpayroll.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/public/auth")
@CrossOrigin(origins = "*")
public class PublicAuthController {
    
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody PublicRegisterAccountDto registerDto) {
        try {
            AuthResponseDto response = authService.register(registerDto);
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponseDto("Erro ao criar conta: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody PublicLoginAccountDto loginDto) {
        try {
            AuthResponseDto response = authService.login(loginDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponseDto("Erro ao fazer login: " + e.getMessage()));
        }
    }

    @PostMapping("/forget-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody PublicForgetPasswordDto forgotPasswordDto) {
        try {
            authService.forgotPassword(forgotPasswordDto);
            return ResponseEntity.ok(new MessageResponseDto("Email de recuperação enviado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponseDto("Erro ao enviar email: " + e.getMessage()));
        }
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@Valid @RequestBody PublicSendVerificationCodeDto verificationDto) {
        try {
            authService.sendVerificationCode(verificationDto);
            return ResponseEntity.ok(new MessageResponseDto("Código de verificação enviado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponseDto("Erro ao enviar código: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@Valid @RequestBody PublicVerifyEmailDto verifyDto) {
        try {
            MessageResponseDto response = authService.verifyEmail(verifyDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponseDto("Erro na verificação: " + e.getMessage()));
        }
    }
}