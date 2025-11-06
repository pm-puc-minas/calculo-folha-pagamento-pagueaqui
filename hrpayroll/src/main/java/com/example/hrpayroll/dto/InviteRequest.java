package com.example.hrpayroll.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteRequest {
    @Email
    @NotBlank
    private String email;

    private String nome;

    private String empresa;

    private String senha;
}
