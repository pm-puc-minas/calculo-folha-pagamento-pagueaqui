package com.example.hrpayroll.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hrpayroll.dto.EmployeeChangePasswordDto;
import com.example.hrpayroll.dto.response.EmployeeAuthControllerListUsers200;
import com.example.hrpayroll.dto.response.EmployeeAuthControllerRegister200;
import com.example.hrpayroll.dto.response.MessageResponseDto;
import com.example.hrpayroll.service.EmployeeAuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employee/auth")
@CrossOrigin(origins = "*")
public class EmployeeAuthController {
    
    @Autowired
    private EmployeeAuthService employeeAuthService;

    @PatchMapping("/change-password")
    public ResponseEntity<?> employeeAuthControllerRegister(@Valid @RequestBody EmployeeChangePasswordDto changePasswordDto) {
        try {
            EmployeeAuthControllerRegister200 response = employeeAuthService.changePassword(changePasswordDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponseDto("Erro ao alterar senha: " + e.getMessage()));
        }
    }

    @GetMapping("/list-users")
    public ResponseEntity<?> employeeAuthControllerListUsers() {
        try {
            EmployeeAuthControllerListUsers200 response = employeeAuthService.listUsers();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponseDto("Erro ao listar usuários: " + e.getMessage()));
        }
    }
}