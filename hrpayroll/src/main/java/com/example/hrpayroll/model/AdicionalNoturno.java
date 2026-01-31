package com.example.hrpayroll.model;

public class AdicionalNoturno extends Adicional {
    private static final double VALOR = 1200;
    private static final String NAME = "ADICIONAL_NOTURNO";

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public double getValor() {
        return VALOR;
    }
}
