package com.example.hrpayroll.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class ProventosModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "funcionario_id")
    private FuncionarioModel funcionario;

    @Column(name = "salario")
    private Double salario;

    @Column(name = "horas_extras")
    private Long horasExtras;

    @Column(name = "adicional_noturno")
    private Boolean adicionalNoturno;

    @Column(name = "adicional_insalubridade")
    private Boolean adicionalInsalubridade;

    @Column(name = "adicional_periculosidade")
    private Boolean adicionalPericulosidade;

    @Column(name = "value_transporte")
    private Boolean valeTransporte;

    @Column(name = "vale_alimentacao_refeicao")
    private Boolean valeAlimentacaoRefeicao;

    @Column(name = "plano_de_saude")
    private Boolean planoDeSaude;

}
