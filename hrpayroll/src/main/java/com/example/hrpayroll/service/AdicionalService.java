package com.example.hrpayroll.service;

import org.springframework.stereotype.Service;

// Melhor usar um ENUM pra armazenar as variáveis globais, talvez?
@Service
public class AdicionalService {
    private static final double SALARIO_MINIMO = 1.518;
    private static final double TAXA_NOTURNO = 0.2;
    private static final double TAXA_INSALUBRIDADE = 0.2;
    private static final Double TAXA_PERICULOSIDADE = 0.3;
    private static final Double TAXA_HORA_EXTRA = 2.0;

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

    // normalmente equivale a 30% do salario normal
    public Double calcularAdicionalPericulosidade(Double salarioLiquido) {
        Double adicional = salarioLiquido * TAXA_PERICULOSIDADE;
        
        return salarioLiquido + adicional;
    }

    // normalmente equivale a 100% do valor da hora normal
    public Double calcularAdicionalHorasExtras(Long horasExtras, Double salarioLiquido) {
        Double valorHora = salarioLiquido / 220;
        Double totalHorasExtra = valorHora * horasExtras * TAXA_HORA_EXTRA;

        return salarioLiquido + totalHorasExtra;
    }
}
