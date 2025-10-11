package com.example.hrpayroll.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    private String password;

    @NotBlank(message = "Tipo de conta é obrigatório")
    private String accountType; //valores: HR, EMPLOYEE, ADMIN
}