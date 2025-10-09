package com.example.hrpayroll.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hrpayroll.dto.PublicForgetPasswordDto;
import com.example.hrpayroll.dto.PublicLoginAccountDto;
import com.example.hrpayroll.dto.PublicRegisterAccountDto;
import com.example.hrpayroll.dto.PublicSendVerificationCodeDto;
import com.example.hrpayroll.dto.PublicVerifyEmailDto;
import com.example.hrpayroll.dto.response.AuthResponseDto;
import com.example.hrpayroll.dto.response.MessageResponseDto;
import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.repository.UserRepository;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;

    public AuthResponseDto register(PublicRegisterAccountDto registerDto) {
        // Verificar se o email já existe
        Optional<FuncionarioModel> existingUser = userRepository.findByEmail(registerDto.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Verificar se o CPF já existe
        Optional<FuncionarioModel> existingCpf = userRepository.findByCpf(registerDto.getCpf());
        if (existingCpf.isPresent()) {
            throw new RuntimeException("CPF já cadastrado");
        }

        // Criar novo funcionário
        FuncionarioModel funcionario = new FuncionarioModel();
        funcionario.setNome(registerDto.getNome());
        funcionario.setSobrenome(registerDto.getSobrenome());
        funcionario.setEmail(registerDto.getEmail());
        funcionario.setSenha(registerDto.getPassword()); // Em produção, deve ser criptografada
        funcionario.setCpf(registerDto.getCpf());
        funcionario.setRg(registerDto.getRg());
        funcionario.setEndereco(registerDto.getEndereco());

        FuncionarioModel savedUser = userRepository.save(funcionario);

        // Simular token JWT (em produção, usar biblioteca JWT)
        String token = "fake-jwt-token-" + UUID.randomUUID().toString();

        return new AuthResponseDto(token, savedUser.getEmail(), savedUser.getNome(), savedUser.getId());
    }

    public AuthResponseDto login(PublicLoginAccountDto loginDto) {
        Optional<FuncionarioModel> user = userRepository.findByEmail(loginDto.getEmail());
        
        if (user.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        FuncionarioModel funcionario = user.get();
        
        // Verificar senha (em produção, usar hash/bcrypt)
        if (!funcionario.getSenha().equals(loginDto.getPassword())) {
            throw new RuntimeException("Senha incorreta");
        }

        // Simular token JWT (em produção, usar biblioteca JWT)
        String token = "fake-jwt-token-" + UUID.randomUUID().toString();

        return new AuthResponseDto(token, funcionario.getEmail(), funcionario.getNome(), funcionario.getId());
    }

    public void forgotPassword(PublicForgetPasswordDto forgotPasswordDto) {
        Optional<FuncionarioModel> user = userRepository.findByEmail(forgotPasswordDto.getEmail());
        
        if (user.isEmpty()) {
            throw new RuntimeException("Email não encontrado");
        }

        // Simular envio de email de recuperação
        System.out.println("Email de recuperação enviado para: " + forgotPasswordDto.getEmail());
    }

    public void sendVerificationCode(PublicSendVerificationCodeDto verificationDto) {
        Optional<FuncionarioModel> user = userRepository.findByEmail(verificationDto.getEmail());
        
        if (user.isEmpty()) {
            throw new RuntimeException("Email não encontrado");
        }

        // Simular envio de código de verificação
        System.out.println("Código de verificação enviado para: " + verificationDto.getEmail());
    }

    public MessageResponseDto verifyEmail(PublicVerifyEmailDto verifyDto) {
        Optional<FuncionarioModel> user = userRepository.findByEmail(verifyDto.getEmail());
        
        if (user.isEmpty()) {
            throw new RuntimeException("Email não encontrado");
        }

        // Simular verificação de código (em produção, verificar código real)
        if (!"123456".equals(verifyDto.getVerificationCode())) {
            throw new RuntimeException("Código de verificação inválido");
        }

        return new MessageResponseDto("Email verificado com sucesso");
    }
}