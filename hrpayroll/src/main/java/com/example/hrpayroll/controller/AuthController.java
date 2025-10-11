package com.example.hrpayroll.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hrpayroll.dto.auth.AuthResponse;
import com.example.hrpayroll.dto.auth.ForgotPasswordRequest;
import com.example.hrpayroll.dto.auth.LoginRequest;
import com.example.hrpayroll.dto.auth.RegisterRequest;
import com.example.hrpayroll.dto.auth.ResetPasswordRequest;
import com.example.hrpayroll.dto.auth.VerifyCodeRequest;
import com.example.hrpayroll.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints para autenticação")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    @Operation(summary = "Registrar novo usuário")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        String result = authService.register(request);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login do usuário")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify")
    @Operation(summary = "Verificar email com código")
    public ResponseEntity<AuthResponse> verifyEmail(@Valid @RequestBody VerifyCodeRequest request) {
        AuthResponse response = authService.verifyEmail(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/send-verification-code")
    @Operation(summary = "Reenviar código de verificação")
    public ResponseEntity<String> resendVerificationCode(@Valid @RequestBody ForgotPasswordRequest request) {
        String result = authService.resendVerificationCode(request);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/forgot-password")
    @Operation(summary = "Solicitar recuperação de senha")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String result = authService.forgotPassword(request);
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/new-password")
    @Operation(summary = "Redefinir senha")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String result = authService.resetPassword(request);
        return ResponseEntity.ok(result);
    }
}