package com.example.hrpayroll.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "folha_item")
public class FolhaItemModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com a Folha de Pagamento principal (Muitos Itens para Uma Folha)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folha_pagamento_id", nullable = false)
    private FolhaPagamentoModel folhaPagamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_item", nullable = false)
    private TipoItemFolha tipo; // Pode ser 'PROVENTO' ou 'DESCONTO'

    @Column(nullable = false, length = 100)
    private String descricao; // Ex: "INSS", "Horas Extras", "Vale Transporte"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor; // O valor monetário do item

    // --- Construtores, Getters e Setters (Omissos para brevidade) ---

    // Construtor vazio
    public FolhaItemModel() {
    }

    // Construtor com campos obrigatórios
    public FolhaItemModel(FolhaPagamentoModel folhaPagamento, TipoItemFolha tipo, String descricao, BigDecimal valor) {
        this.folhaPagamento = folhaPagamento;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    // --- Getters e Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FolhaPagamentoModel getFolhaPagamento() {
        return folhaPagamento;
    }

    public void setFolhaPagamento(FolhaPagamentoModel folhaPagamento) {
        this.folhaPagamento = folhaPagamento;
    }

    public TipoItemFolha getTipo() {
        return tipo;
    }

    public void setTipo(TipoItemFolha tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}