package com.example.hrpayroll.service;

import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.model.ProventosModel;
import com.example.hrpayroll.repository.IFuncionarioRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioService {
        private IFuncionarioRepository IFuncionarioRepository;
        private DescontosService descontoService;
        private AdicionalService adicionalService;

        public FuncionarioService(
                IFuncionarioRepository IFuncionarioRepository,
                DescontosService descontoService,
                AdicionalService adicionalService) {
                this.IFuncionarioRepository = IFuncionarioRepository;
                this.descontoService = descontoService;
                this.adicionalService = adicionalService;
        }

        public FuncionarioModel create(FuncionarioModel funcionarioModel) {
                return IFuncionarioRepository.save(funcionarioModel);
        }

        public List<FuncionarioModel> list() {
                return IFuncionarioRepository.findAll();
        }

        public FuncionarioModel findOneById(Long id) {
                Optional<FuncionarioModel> funcionario = IFuncionarioRepository.findById(id);

                if (funcionario.isPresent()) {
                    return funcionario.get();
                }

                return null;
        }

    public FuncionarioModel atualizarCadastro(Long id, FuncionarioModel novosDados) {
        Optional<FuncionarioModel> usuarioOpt = IFuncionarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        FuncionarioModel usuario = usuarioOpt.get();

        usuario.setNome(novosDados.getNome());
        usuario.setSobrenome(novosDados.getSobrenome());
        usuario.setEmail(novosDados.getEmail());
        usuario.setEndereco(novosDados.getEndereco());
        usuario.setDataNascimento(novosDados.getDataNascimento());

        return IFuncionarioRepository.save(usuario);
    }

    public Double salarioLiquidoById(Long id) {
        FuncionarioModel funcionario = this.findOneById(id);
        if (funcionario == null) {
            throw new IllegalArgumentException("Funcionário com ID " + id + " não encontrado.");
        }

        if (funcionario.getCargo() == null) {
            throw new IllegalStateException("Funcionário com ID " + id + " não possui cargo atribuído.");
        }

        ProventosModel proventos = funcionario.getProventos();

        Double salarioLiquido = funcionario.getCargo().getSalarioBase();

        if (proventos.getAdicionalNoturno() == true) {
            salarioLiquido = adicionalService.calcularAdicionalNoturno(salarioLiquido);
        }

        if (proventos.getAdicionalInsalubridade() == true) {
            salarioLiquido = adicionalService.calcularAdicionalInsalubridade(salarioLiquido);
        }

        if (proventos.getAdicionalPericulosidade() == true) {
            salarioLiquido = adicionalService.calcularAdicionalPericulosidade(salarioLiquido);
        }

        if (proventos.getValeTransporte() == true) {
            salarioLiquido = descontoService.calcularDescontoValeTransporte(salarioLiquido);
        }

        if (proventos.getPlanoDeSaude() == true) {
            salarioLiquido = descontoService.calcularDescontoPlanoDeSaude(salarioLiquido);
        }

        if (proventos.getValeAlimentacaoRefeicao() == true) {
            salarioLiquido = descontoService.calcularDescontoValeAlimentacao(salarioLiquido);
        }

        if (proventos.getHorasExtras() > 0) {
            salarioLiquido = adicionalService.calcularAdicionalHorasExtras(proventos.getHorasExtras(), salarioLiquido);
        }

        return salarioLiquido;

    }
}
