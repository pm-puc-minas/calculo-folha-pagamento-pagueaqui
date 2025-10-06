package com.example.hrpayroll.model;

public enum TipoDesconto {
    PERCENTUAL("Desconto Percentual", "%"),
    FIXO("Desconto Fixo", "R$");

    private final String descricao;
    private final String simbolo;

    TipoDesconto(String descricao, String simbolo) {
        this.descricao = descricao;
        this.simbolo = simbolo;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getSimbolo() {
        return simbolo;
    }
}
