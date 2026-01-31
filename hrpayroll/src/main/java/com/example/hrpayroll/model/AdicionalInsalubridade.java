package com.example.hrpayroll.model;

public class AdicionalInsalubridade extends Adicional {
    private static final double VALOR = 400;
    private static final String NAME = "ADICIONAL_INSALUBRIDADE";

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public double getValor() {
        return VALOR;
    }
}
