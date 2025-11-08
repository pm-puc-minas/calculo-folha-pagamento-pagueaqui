package com.example.hrpayroll.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hrpayroll.dto.auth.AuthResponse;
import com.example.hrpayroll.dto.auth.ForgotPasswordRequest;
import com.example.hrpayroll.dto.auth.LoginRequest;
import com.example.hrpayroll.dto.auth.RegisterRequest;
import com.example.hrpayroll.dto.auth.ResetPasswordRequest;
import com.example.hrpayroll.dto.auth.VerifyCodeRequest;
import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.model.User;
import com.example.hrpayroll.repository.ICompanyRepository;
import com.example.hrpayroll.repository.IUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final IUserRepository IUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final ICompanyRepository ICompanyRepository;
    
    @Transactional
    public String register(RegisterRequest request) {
        if (IUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }
        // validar empresa
        CompanyModel company = ICompanyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.HR);
        user.setEmailVerified(false);
        user.setCompany(company);
        
        // gerar código de verificação
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(24));
        
        IUserRepository.save(user);
        
        // enviar email de verificação
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        
        return "Usuário registrado com sucesso. Verifique seu email.";
    }
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = IUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email não verificado. Verifique sua caixa de entrada.");
        }

        // validar tipo de conta solicitado x perfil do usuário
        String requestedType = request.getAccountType();
        if (requestedType == null || requestedType.isBlank()) {
            throw new RuntimeException("Tipo de conta é obrigatório");
        }
        try {
            User.Role requestedRole = User.Role.valueOf(requestedType.toUpperCase());
            if (!user.getRole().equals(requestedRole)) {
                throw new RuntimeException("Credenciais não pertencem ao tipo de conta selecionado");
            }
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Tipo de conta inválido");
        }
        
        String jwtToken = jwtService.generateToken(user);
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
        
        return new AuthResponse(jwtToken, userDto);
    }
    
    @Transactional
    public AuthResponse verifyEmail(VerifyCodeRequest request) {
        User user = IUserRepository.findByVerificationCode(request.getCode())
                .orElseThrow(() -> new RuntimeException("Código de verificação inválido"));
        
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código de verificação expirado");
        }
        
        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        IUserRepository.save(user);
        
        String jwtToken = jwtService.generateToken(user);
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
        
        return new AuthResponse(jwtToken, userDto);
    }
    
    @Transactional
    public String resendVerificationCode(ForgotPasswordRequest request) {
        User user = IUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (request.getAccountType() != null && !request.getAccountType().isBlank()) {
            try {
                User.Role requestedRole = User.Role.valueOf(request.getAccountType().toUpperCase());
                if (!user.getRole().equals(requestedRole)) {
                    throw new RuntimeException("Email não corresponde ao tipo de conta selecionado");
                }
            } catch (IllegalArgumentException ex) {
                throw new RuntimeException("Tipo de conta inválido");
            }
        }

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email já está verificado");
        }
        
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusHours(24));
        IUserRepository.save(user);
        
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);
        
        return "Código de verificação reenviado";
    }
    
    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = IUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // validar tipo de conta solicitado x perfil do usuário
        String requestedType = request.getAccountType();
        if (requestedType == null || requestedType.isBlank()) {
            throw new RuntimeException("Tipo de conta é obrigatório");
        }
        try {
            User.Role requestedRole = User.Role.valueOf(requestedType.toUpperCase());
            if (!user.getRole().equals(requestedRole)) {
                throw new RuntimeException("Email não corresponde ao tipo de conta selecionado");
            }
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Tipo de conta inválido");
        }
        
        String resetToken = generateResetToken();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordExpiresAt(LocalDateTime.now().plusHours(1));
        IUserRepository.save(user);
        
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        
        return "Email de recuperação de senha enviado";
    }
    
    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        User user = IUserRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token de reset inválido"));
        
        if (user.getResetPasswordExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token de reset expirado");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiresAt(null);
        IUserRepository.save(user);
        
        return "Senha alterada com sucesso";
    }
    
    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
    
    private String generateResetToken() {
        return java.util.UUID.randomUUID().toString();
    }
}