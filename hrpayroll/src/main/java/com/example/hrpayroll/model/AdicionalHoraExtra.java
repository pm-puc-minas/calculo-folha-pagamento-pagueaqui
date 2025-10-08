package com.example.hrpayroll.model;

public class AdicionalHoraExtra extends Adicional {
    private static final double VALOR = 800;
    private static final String NAME = "ADICIONAL_HORA_EXTRA";

    @Override
    public String getName() {
        return NAME;
    }

    @Override
    public double getValor() {
        return VALOR;
    }
}
