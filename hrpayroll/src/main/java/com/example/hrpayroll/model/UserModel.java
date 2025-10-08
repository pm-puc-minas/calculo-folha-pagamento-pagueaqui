package com.example.hrpayroll.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import java.util.Date;

import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    @NotBlank
    private String sobrenome;


    @NotBlank(message = "O CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "O CPF deve conter 11 dígitos numéricos")
    @Column(unique = true, nullable = false, name = "CPF")
    private String cpf;

    @NotBlank(message = "O RG é obrigatório")
    @Column(name = "RG")
    private String rg;

    @Email(message = "E-mail inválido")
    @NotBlank(message = "O e-mail é obrigatório")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "O endereço é obrigatório")
    private String endereco;

    @Past(message = "A data de nascimento deve ser anterior à data atual")
    @Column(name = "data_de_nascimento")
    private Date dataNascimento;

    @Column(name = "PIS")
    private Double pis;

    @Column(name = "data_de_admissao")
    private Date dataDeAdmissao;

    @Column(name = "cargo")
    private String cargo;

    @NotBlank()
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = "Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.")
    private String senha;
}
