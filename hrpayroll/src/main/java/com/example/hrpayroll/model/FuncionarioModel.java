package com.example.hrpayroll.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Past;

import java.util.Date;

import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "funcionario")
public class FuncionarioModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    @NotBlank
    private String sobrenome;

    @NotBlank(message = "O CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "O CPF deve conter 11 dígitos numéricos")
    @Column(unique = true, name = "CPF")
    private String cpf;

    @NotBlank(message = "O RG é obrigatório")
    @Column(name = "RG")
    private String rg;

    @NotBlank(message = "O e-mail é obrigatório")
    @Column(unique = true, nullable = false)
    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank
    private String endereco;

    @Past(message = "A data de nascimento deve ser anterior à data atual")
    @Column(name = "data_de_nascimento")
    private Date dataNascimento;

    @Column(name = "PIS")
    private Double pis;

    @Column(name = "data_de_admissao")
    private Date dataDeAdmissao;

    @Column(name = "cargo")
    private CargoModel cargo;

    @NotBlank
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = "Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.")
    private String senha;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "proventos_id")
    private ProventosModel proventos;
}
