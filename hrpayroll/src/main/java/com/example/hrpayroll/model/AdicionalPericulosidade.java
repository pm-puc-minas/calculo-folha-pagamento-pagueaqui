package com.example.hrpayroll.model;

public class AdicionalPericulosidade extends Adicional {
    private static final double VALOR = 750;
    private static final String NAME = "ADICIONAL_PERICULOSIDADE";

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public double getValor() {
        return VALOR;
    }
}
