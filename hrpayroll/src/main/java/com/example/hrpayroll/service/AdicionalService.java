package com.example.hrpayroll.service;

import org.springframework.stereotype.Service;

@Service
public class AdicionalService {

    public Double calcularAdicionalNoturno(Double salario) {
        return salario;
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
