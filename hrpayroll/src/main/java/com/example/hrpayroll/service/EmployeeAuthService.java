package com.example.hrpayroll.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hrpayroll.dto.EmployeeChangePasswordDto;
import com.example.hrpayroll.dto.response.EmployeeAuthControllerListUsers200;
import com.example.hrpayroll.dto.response.EmployeeAuthControllerRegister200;
import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.repository.UserRepository;

@Service
public class EmployeeAuthService {
    
    @Autowired
    private UserRepository userRepository;

    public EmployeeAuthControllerRegister200 changePassword(EmployeeChangePasswordDto changePasswordDto) {
        // Validar se as senhas coincidem
        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmPassword())) {
            throw new RuntimeException("As senhas não coincidem");
        }

        // Em um cenário real, você decodificaria o token para obter o ID do usuário
        // Por enquanto, vamos simular que o token contém informações do usuário
        // Aqui você implementaria a lógica de validação do token
        
        // Simulação: extrair email/ID do token (implementar decodificação JWT real)
        String userEmail = extractEmailFromToken(changePasswordDto.getToken());
        
        Optional<FuncionarioModel> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        FuncionarioModel user = userOptional.get();
        
        // Validar força da senha (a validação está no modelo, mas podemos adicionar aqui também)
        validatePasswordStrength(changePasswordDto.getNewPassword());
        
        // Atualizar a senha (em produção, deve ser criptografada)
        user.setSenha(changePasswordDto.getNewPassword());
        userRepository.save(user);

        return new EmployeeAuthControllerRegister200("Senha alterada com sucesso", true);
    }

    public EmployeeAuthControllerListUsers200 listUsers() {
        List<FuncionarioModel> users = userRepository.findAll();
        
        List<EmployeeAuthControllerListUsers200.UserSummaryDto> userSummaries = users.stream()
            .map(user -> new EmployeeAuthControllerListUsers200.UserSummaryDto(
                user.getId(),
                user.getNome(),
                user.getSobrenome(),
                user.getEmail(),
                user.getCargo()
            ))
            .collect(Collectors.toList());

        return new EmployeeAuthControllerListUsers200(userSummaries, users.size());
    }

    private String extractEmailFromToken(String token) {
        // Implementação simplificada - em produção, use biblioteca JWT
        // Por enquanto, retornamos um email de exemplo
        // TODO: Implementar decodificação JWT real
        if (token.equals("valid-token")) {
            return "admin@example.com";
        }
        throw new RuntimeException("Token inválido");
    }

    private void validatePasswordStrength(String password) {
        if (password.length() < 8) {
            throw new RuntimeException("A senha deve ter no mínimo 8 caracteres");
        }
        
        if (!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")) {
            throw new RuntimeException("Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.");
        }
    }
}