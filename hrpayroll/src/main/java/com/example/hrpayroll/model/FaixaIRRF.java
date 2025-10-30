package com.example.hrpayroll.model;

public class FaixaIRRF {
    public final double min;
    public final double max;
    public final double aliquota;
    public final double deducao;

    public FaixaIRRF(double min, double max, double aliquota, double deducao) {
        this.min = min;
        this.max = max;
        this.aliquota = aliquota;
        this.deducao = deducao;
    }
}