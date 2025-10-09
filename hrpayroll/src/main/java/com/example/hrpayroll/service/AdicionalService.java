package com.example.hrpayroll.service;

import org.springframework.stereotype.Service;

@Service
public class AdicionalService {
    private static final Double TAXA_PERICULOSIDADE = 0.3;
    private static final Double TAXA_HORA_EXTRA = 2.0;

    public Double calcularAdicionalNoturno(Double salarioLiquido) {
        return salarioLiquido;
    }

    public Double calcularAdicionalInsalubridade(Double salarioLiquido) {
        return salarioLiquido;
    }

    public Double calcularAdicionalPericulosidade(Double salarioLiquido) {
        Double adicional = salarioLiquido * TAXA_PERICULOSIDADE;
        
        return salarioLiquido + adicional;
    }

    public Double calcularAdicionalHorasExtras(Long horasExtras, Double salarioLiquido) {
        Double valorHora = salarioLiquido / 220;
        Double totalHorasExtra = valorHora * horasExtras * TAXA_HORA_EXTRA;

        return salarioLiquido + totalHorasExtra;
    }
}
