package com.example.hrpayroll.dto;

import jakarta.validation.constraints.NotBlank;

public class EmployeeChangePasswordDto {
    
    @NotBlank(message = "O token é obrigatório")
    private String token;
    
    @NotBlank(message = "A nova senha é obrigatória")
    private String newPassword;
    
    @NotBlank(message = "A confirmação da senha é obrigatória")
    private String confirmPassword;
    
    // Constructors
    public EmployeeChangePasswordDto() {}
    
    public EmployeeChangePasswordDto(String token, String newPassword, String confirmPassword) {
        this.token = token;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getNewPassword() {
        return newPassword;
    }
    
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
    
    public String getConfirmPassword() {
        return confirmPassword;
    }
    
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}