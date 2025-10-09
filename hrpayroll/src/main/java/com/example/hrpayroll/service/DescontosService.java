package com.example.hrpayroll.service;

import com.example.hrpayroll.model.DescontosModel;
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

            // Atualiza o objeto DescontosModel
//            d.setInss(inss);

            // Calcula o salário líquido e salva no objeto
            double salarioLiquido = salario - inss;
//            d.setSalarioLiquido(salarioLiquido);

            // Salva as alterações no banco
            descontosRepository.save(d);

        } else {
            System.out.println("Nenhum desconto encontrado para o id: " + id);
        }
    }

    public Double calcularAdicionalNoturno(Double salario) {
        return null;
    }

    public Double calcularAdicionalInsalubridade(Double salario) {
        return null;
    }

    public Double calcularAdicionalPericulosidade(Double salario) {
        return null;
    }

}
