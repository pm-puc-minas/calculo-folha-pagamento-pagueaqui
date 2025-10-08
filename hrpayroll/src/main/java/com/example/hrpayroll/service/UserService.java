package com.example.hrpayroll.service;

import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
        @Autowired
        private final UserRepository userRepository;

        public UserService(UserRepository userRepository) {
                this.userRepository = userRepository;
        }

        public FuncionarioModel create(FuncionarioModel funcionarioModel) {
                return userRepository.save(funcionarioModel);
        }

        public List<FuncionarioModel> list() {
                return userRepository.findAll();
        }

        public FuncionarioModel findOneById(Long id) {
                Optional<FuncionarioModel> funcionario = userRepository.findById(id);

                if (funcionario.isPresent()) {
                    return funcionario.get();
                }

                return null;
        }

    public FuncionarioModel atualizarCadastro(Long id, FuncionarioModel novosDados) {
        Optional<FuncionarioModel> usuarioOpt = userRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        FuncionarioModel usuario = usuarioOpt.get();

        usuario.setNome(novosDados.getNome());
        usuario.setSobrenome(novosDados.getSobrenome());
        usuario.setEmail(novosDados.getEmail());
        usuario.setEndereco(novosDados.getEndereco());
        usuario.setDataNascimento(novosDados.getDataNascimento());

        return userRepository.save(usuario);
    }
}
