package com.example.hrpayroll.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hrpayroll.model.DescontosModel;
import com.example.hrpayroll.repository.IDescontosRepository;
import com.example.hrpayroll.repository.ICalculoRepository;

@Service
public class DescontosService {

    @Autowired
    private IDescontosRepository descontosRepository;
    private ICalculoRepository calculoRepository;

    public List<DescontosModel> listarTodos() {
        return descontosRepository.findAll();
    }

    public List<DescontosModel> listarAtivos() {
        return descontosRepository.findByAtivoTrue();
    }

    public Optional<DescontosModel> buscarPorId(Long id) {
        return descontosRepository.findById(id);
    }

    public DescontosModel salvar(DescontosModel desconto) {
        return descontosRepository.save(desconto);
    }

    public DescontosModel atualizar(Long id, DescontosModel desconto) {
        if (!descontosRepository.existsById(id)) {
            throw new RuntimeException("Desconto não encontrado");
        }
        desconto.setId(id);
        return descontosRepository.save(desconto);
    }

    public void deletar(Long id) {
        descontosRepository.deleteById(id);
    }

    public void inativar(Long id) {
        DescontosModel desconto = descontosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Desconto não encontrado"));
        desconto.setAtivo(false);
        descontosRepository.save(desconto);
    }

    public double calcularINSS(double salario) {
        double inss = 0.0;

        if (salario > 7786.02) salario = 7786.02;

        if (salario <= 1412.00) {
            inss = salario * 0.075;

        } else if (salario <= 2666.68) {
            inss = (1412.00 * 0.075)
                    + (salario - 1412.00) * 0.09;

        } else if (salario <= 4000.03) {
            inss = (1412.00 * 0.075)
                    + ((2666.68 - 1412.00) * 0.09)
                    + (salario - 2666.68) * 0.12;

        } else {
            inss = (1412.00 * 0.075)
                    + ((2666.68 - 1412.00) * 0.09)
                    + ((4000.03 - 2666.68) * 0.12)
                    + (salario - 4000.03) * 0.14;
        }

        return inss;
    }


    public Double calcularIRRF(Double salario) {
        double inss = calcularINSS(salario);
        double baseCalculo = salario - inss - 528.00;
        double irrf;

        if (baseCalculo <= 2112.00) {
            irrf = 0.0;
        } else if (baseCalculo <= 2826.65) {
            irrf = (baseCalculo * 0.075) - 158.40;
        } else if (baseCalculo <= 3751.05) {
            irrf = (baseCalculo * 0.15) - 370.40;
        } else if (baseCalculo <= 4664.68) {
            irrf = (baseCalculo * 0.225) - 651.73;
        } else {
            irrf = (baseCalculo * 0.275) - 884.96;
        }

        return Math.max(irrf, 0.0);
    }

    public Double calcularDescontoValeTransporte(Double salario) {
        return salario * 0.06;
    }

    public Double calcularDescontoPlanoDeSaude(Double salario) {
        return salario * 0.03;
    }

    public Double calcularDescontoValeAlimentacao(Double salario) {
        return salario * 0.10;
    }

    public Double calcularTotalDescontos(Double salario) {
        return calcularDescontoValeTransporte(salario)
                + calcularDescontoPlanoDeSaude(salario)
                + calcularDescontoValeAlimentacao(salario);
    }
}