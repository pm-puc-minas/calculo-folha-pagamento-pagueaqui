package com.example.hrpayroll.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@Table(name = "proventos")
public class ProventosModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "funcionario_id")
    @JsonBackReference
    private FuncionarioModel funcionario;

    @Column(name = "horas_extras", columnDefinition = "bigint default 0")
    private Long horasExtras = 0L;

    @Column(name = "adicional_noturno", columnDefinition = "boolean default false")
    private Boolean adicionalNoturno = false;

    @Column(name = "adicional_insalubridade", columnDefinition = "boolean default false")
    private Boolean adicionalInsalubridade = false;

    @Column(name = "adicional_periculosidade", columnDefinition = "boolean default false")
    private Boolean adicionalPericulosidade = false;

    @Column(name = "value_transporte",columnDefinition = "boolean default false")
    private Boolean valeTransporte = false;

    @Column(name = "vale_alimentacao_refeicao", columnDefinition = "boolean default false")
    private Boolean valeAlimentacaoRefeicao = false;

    @Column(name = "plano_de_saude", columnDefinition = "boolean default false")
    private Boolean planoDeSaude = false;

    public void setSalarioBruto(BigDecimal bigDecimal) {
    }
}
