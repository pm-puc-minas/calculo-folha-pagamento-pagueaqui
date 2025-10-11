package com.example.hrpayroll.service;

import com.example.hrpayroll.model.DescontosModel;
import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.model.ProventosModel;
import com.example.hrpayroll.repository.DescontosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DescontosService {

    @Autowired
    private DescontosRepository descontosRepository;

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

    public void calcularINSS(Long id, DescontosModel desconto, Double salario) {
        Optional<DescontosModel> descontoEncontrado = buscarPorId(id);

        if (descontoEncontrado.isPresent()) {
            DescontosModel d = descontoEncontrado.get();

            // Cálculo progressivo do INSS
            double inss = 0.0;

            // Faixa 1: até R$ 1.412,00 → 7,5%
            if (salario > 0) {
                double faixa = Math.min(salario, 1412.00);
                inss += faixa * 0.075;
            }

            // Faixa 2: 1.412,01 até 2.666,68 → 9%
            if (salario > 1412.00) {
                double faixa = Math.min(salario, 2666.68) - 1412.00;
                inss += faixa * 0.09;
            }

            // Faixa 3: 2.666,69 até 4.000,03 → 12%
            if (salario > 2666.68) {
                double faixa = Math.min(salario, 4000.03) - 2666.68;
                inss += faixa * 0.12;
            }

            // Faixa 4: 4.000,04 até 7.786,02 → 14%
            if (salario > 4000.03) {
                double faixa = Math.min(salario, 7786.02) - 4000.03;
                inss += faixa * 0.14;
            }

            // Calculo do imposto de reda conforme tabela 2024
            double baseCalculo = salario - inss - 528.00; // desconto simplificado

            double irrf = 0.0;

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

            if (irrf < 0) irrf = 0.0; // não pode ter imposto negativo

            // Atualiza o objeto DescontosModel
//            d.setInss(inss);

            // Calcula o salário líquido e salva no objeto
            double salarioLiquido = salario - inss - irrf;
//            d.setSalarioLiquido(salarioLiquido);

            // Salva as alterações no banco
            descontosRepository.save(d);

        } else {
            System.out.println("Nenhum desconto encontrado para o id: " + id);
        }
    }

    public Double calcularDescontoValeTransporte(Double salario) {
        Optional<DescontosModel> descontoEncontrado;
        double baseCalculo = salario;
        double salarioLiquido;
        return salarioLiquido = salario - (salario * 0.06);

    }

    public Double calcularDescontoPlanoDeSaude(Double salario) {
        ProventosModel proventos = new ProventosModel();
        proventos.setPlanoDeSaude(true); // ou false, dependendo do teste

        if (!proventos.getPlanoDeSaude()) {
            return salario;
        } else {
            return salario - (salario * 0.03);
        }
    }




    public Double calcularDescontoValeAlimentacao(Double salario) {
        return salario - (salario * 0.1);
    }

    public Double calcularTotalDescontos(Double salario) {
        double totalDescontos = 0.0;

        totalDescontos = calcularDescontoValeTransporte(salario) + calcularDescontoValeAlimentacao(salario) + calcularDescontoPlanoDeSaude(salario);

        return salario - totalDescontos;
    }
}