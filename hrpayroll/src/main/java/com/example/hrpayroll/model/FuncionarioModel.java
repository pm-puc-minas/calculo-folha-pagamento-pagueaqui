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

    @NotBlank(message = "O e-mail é obrigatório")
    @Column(name = "email_profissional",unique = true, nullable = false)
    @Email(message = "E-mail inválido")
    private String emailProfissional;

    @Past(message = "A data de nascimento deve ser anterior à data atual")
    @Column(name = "data_de_nascimento")
    private Date dataDeNascimento;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "PIS")
    private Double pis;

    @Column(name = "data_de_admissao")
    private Date dataDeAdmissao;

    @ManyToOne
    @JoinColumn(name = "cargo_id")
    private CargoModel cargo;

    @NotBlank
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = "Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.")
    private String senha;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "proventos_id")
    private ProventosModel proventos;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private CompanyModel company;

    @Column(name = "genero")
    private String genero;

    @Column(name = "estado_civil")
    private String estadoCivil;

    @Column(name = "nacionalidade")
    private String nacionalidade;

    @Column(name = "cep")
    private String cep;

    @Column(name = "rua")
    private String rua;

    @Column(name = "numero")
    private String numero;

    @Column(name = "estado")
    private String estado;

    @Column(name = "cidade")
    private String cidade;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "banco_usuario_id")
    private BankInfoModel bancoInfoModel;

}
