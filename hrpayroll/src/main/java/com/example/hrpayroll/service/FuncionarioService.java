package com.example.hrpayroll.service;

import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.model.ProventosModel;
import com.example.hrpayroll.repository.FuncionarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FuncionarioService {
        private FuncionarioRepository funcionarioRepository;
        private DescontosService descontoService;

        public FuncionarioService(FuncionarioRepository funcionarioRepository, DescontosService descontoService) {
                this.funcionarioRepository = funcionarioRepository;
                this.descontoService = descontoService;
        }

        public FuncionarioModel create(FuncionarioModel funcionarioModel) {
                return funcionarioRepository.save(funcionarioModel);
        }

        public List<FuncionarioModel> list() {
                return funcionarioRepository.findAll();
        }

        public FuncionarioModel findOneById(Long id) {
                Optional<FuncionarioModel> funcionario = funcionarioRepository.findById(id);

                if (funcionario.isPresent()) {
                    return funcionario.get();
                }

                return null;
        }

    public FuncionarioModel atualizarCadastro(Long id, FuncionarioModel novosDados) {
        Optional<FuncionarioModel> usuarioOpt = funcionarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        FuncionarioModel usuario = usuarioOpt.get();

        usuario.setNome(novosDados.getNome());
        usuario.setSobrenome(novosDados.getSobrenome());
        usuario.setEmail(novosDados.getEmail());
        usuario.setEndereco(novosDados.getEndereco());
        usuario.setDataNascimento(novosDados.getDataNascimento());

        return funcionarioRepository.save(usuario);
    }

    public Double salarioLiquidoById(Long id) {
        FuncionarioModel funcionario = this.findOneById(id);
        if (funcionario == null) return null;

        ProventosModel proventos = funcionario.getProventos();
        Double salarioLiquido = proventos.getSalarioBruto();

        if (proventos.getAdicionalNoturno()) {
            salarioLiquido = descontoService.calcularAdicionalNoturno(salarioLiquido);
        }

        if (proventos.getAdicionalInsalubridade()) {
            salarioLiquido = descontoService.calcularAdicionalInsalubridade(salarioLiquido);
        }

        if (proventos.getAdicionalPericulosidade()) {
            salarioLiquido = descontoService.
        }

    }
}
