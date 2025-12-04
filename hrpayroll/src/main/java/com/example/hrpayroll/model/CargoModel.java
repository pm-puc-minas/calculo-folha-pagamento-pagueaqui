package com.example.hrpayroll.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cargo")
public class CargoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String name;

    @NotNull(message = "O cargo deve estar associado a um departamento.")
    @ManyToOne(optional = false)
    @JoinColumn(name = "departamento_id", nullable = false)
    @JsonBackReference
    private DepartamentoModel departamento;

    @Column(name = "salario_base")
    private Double salarioBase;

    @Column(name = "ativo")
    private Boolean ativo;

}
