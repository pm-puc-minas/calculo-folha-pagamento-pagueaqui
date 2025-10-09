package com.example.hrpayroll.service;

import org.springframework.stereotype.Service;

@Service
public class AdicionalService {
    private static final double SALARIO_MINIMO = 1.518;

    // normalmente equivale a 20% do salario normal
    public Double calcularAdicionalNoturno(Double salario) {
        Double adicional = salario * 0.20;
        return salario + adicional;
    }

    // levando em consideração 20% (grau medio)
    public Double calcularAdicionalInsalubridade(Double salario) {
        Double insalubridade = SALARIO_MINIMO * 0.20;
        return salario + insalubridade;
    }

    public Double calcularAdicionalPericulosidade(Double salario) {
        return salario;
    }

    public Double calcularAdicionalHorasExtras(Long horasExtras, Double salarioLiquido) {
        return salarioLiquido;
    }
}
