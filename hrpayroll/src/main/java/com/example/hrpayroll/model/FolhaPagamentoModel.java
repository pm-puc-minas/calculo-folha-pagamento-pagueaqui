package com.example.hrpayroll.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class FolhaPagamentoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull (message = "A empresa é obrigatoria")
    @ManyToOne(fetch = FetchType.LAZY)  // permite que muitas folhas de pagto pertençam a uma empresa
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyModel company;

    @NotNull (message = "A data da folha é obrigatoria")
    private LocalDate dataFolha;

    @NotNull (message = "O valor total é obrigatorio")
    private BigDecimal valorTotal;

    private Integer numeroHorasTrabalhadas;
    private BigDecimal salarioBase;
    private String observacoes;

    @OneToMany(mappedBy = "folhaPagamento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FolhaItemModel> itens = new ArrayList<>();
}
