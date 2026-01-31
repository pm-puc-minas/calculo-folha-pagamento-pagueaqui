package com.example.hrpayroll.model;

public abstract class Adicional {
    public Adicional() {}

    public abstract String getName();

    public abstract double getValor();

    public double calcular(double salario) {
        return salario + getValor();
    }
}
