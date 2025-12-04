package com.example.hrpayroll.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "usuario_banco_informacao")
public class BankInfoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column()
    private String conta;

    @Column()
    private String agencia;

    @Column(name = "codigo_banco")
    private Integer codigoBanco;

    @Column(name = "digito_verificador")
    private String digitoVerificador;

    @Column(name = "banco")
    private String banco;

}
