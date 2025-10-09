package com.example.hrpayroll.service;

import org.springframework.stereotype.Service;

@Service
public class AdicionalService {

    public Double calcularAdicionalNoturno(Double salario) {
        Double adicional = salario * 0.20;
        return salario + adicional;
    }

    public Double calcularAdicionalInsalubridade(Double salario) {

        return salario;
    }

    public Double calcularAdicionalPericulosidade(Double salario) {
        return salario;
    }

    public Double calcularAdicionalHorasExtras(Long horasExtras, Double salarioLiquido) {
        return salarioLiquido;
    }
}
