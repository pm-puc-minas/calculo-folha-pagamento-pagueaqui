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

    public Double calcularINSS(Long id, Double salario) {
        Optional<DescontosModel> descontoEncontrado = buscarPorId(id);

        if (descontoEncontrado.isPresent()) {
            DescontosModel d = descontoEncontrado.get();

            double inss = 0.0;

            if (salario > 0) {
                double faixa = Math.min(salario, 1412.00);
                inss += faixa * 0.075;
            }

            if (salario > 1412.00) {
                double faixa = Math.min(salario, 2666.68) - 1412.00;
                inss += faixa * 0.09;
            }

            if (salario > 2666.68) {
                double faixa = Math.min(salario, 4000.03) - 2666.68;
                inss += faixa * 0.12;
            }

            if (salario > 4000.03) {
                double faixa = Math.min(salario, 7786.02) - 4000.03;
                inss += faixa * 0.14;
            }
            d.setInss(inss);

            return inss;
        } else {
            System.out.println("Nenhum desconto encontrado para o id: " + id);
            return 0.0;
        }
    }

    public Double calcularIRRF(Long id, Double salario) {
        Optional<DescontosModel> descontoEncontrado = buscarPorId(id);

        if (descontoEncontrado.isPresent()) {
            DescontosModel d = descontoEncontrado.get();

            double inss = calcularINSS(id, salario);

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

            irrf = Math.max(irrf, 0.0);

            d.setIrrf(irrf);

            return irrf;

        } else {
            System.out.println("Nenhum desconto encontrado para o id: " + id);
            return 0.0;
        }
    }

    public Double calcularDescontoValeTransporte(Double salario) {
        return salario * 0.06;
    }

    public Double calcularDescontoPlanoDeSaude(Double salario) {
        ProventosModel proventos = new ProventosModel();
        proventos.setPlanoDeSaude(true); // ou false, dependendo do teste

        if (!proventos.getPlanoDeSaude()) {
            return 0.0;
        } else {
            return salario * 0.03;
        }
    }

    public Double calcularDescontoValeAlimentacao(Double salario) {
        return salario * 0.10;
    }

    public Double calcularTotalDescontos(Double salario) {
        double vt = calcularDescontoValeTransporte(salario);
        double ps = calcularDescontoPlanoDeSaude(salario);
        double va = calcularDescontoValeAlimentacao(salario);

        return vt + ps + va;
    }

    public Double calcularSalarioLiquido(Long idFuncionario, Double salario) {
        Optional<DescontosModel> descontoEncontrado = buscarPorId(idFuncionario);

        if (descontoEncontrado.isPresent()) {
            DescontosModel d = descontoEncontrado.get();

            double inss = calcularINSS(idFuncionario, salario);
            double irrf = calcularIRRF(idFuncionario, salario);

            // salva no DescontosModel
            d.setInss(inss);
            d.setIrrf(irrf);
            d.setSalarioLiquido(salario - inss - irrf - calcularTotalDescontos(salario));
            descontosRepository.save(d);

            return d.getSalarioLiquido();
        } else {
            System.out.println("Nenhum desconto encontrado para o id: " + idFuncionario);
            return salario;
        }
    }
}