package com.example.hrpayroll.service;

import org.springframework.stereotype.Service;

@Service
public class AdicionalService {
    private static final double SALARIO_MINIMO = 1.518;
    private static final double TAXA_NOTURNO = 0.2;
    private static final double TAXA_INSALUBRIDADE = 0.2;


    // normalmente equivale a 20% do salario normal
    public Double calcularAdicionalNoturno(Double salarioLiquido) {
        Double adicional = salarioLiquido * TAXA_NOTURNO;
        return salarioLiquido + adicional;
    }

    // levando em consideração 20% (grau medio)
    public Double calcularAdicionalInsalubridade(Double salarioLiquido) {
        Double insalubridade = SALARIO_MINIMO * TAXA_INSALUBRIDADE;
        return salarioLiquido + insalubridade;
    }

    public Double calcularAdicionalPericulosidade(Double salarioLiquido) {
        return salarioLiquido;
    }

    public Double calcularAdicionalHorasExtras(Long horasExtras, Double salarioLiquido) {
        return salarioLiquido;
    }
}
