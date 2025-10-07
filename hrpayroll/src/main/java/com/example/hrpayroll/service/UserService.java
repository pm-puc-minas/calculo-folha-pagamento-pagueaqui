package com.example.hrpayroll.service;

import com.example.hrpayroll.model.UserModel;
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

        public UserModel create(UserModel userModel) {
                return userRepository.save(userModel);
        }

        public List<UserModel> list() {
                return userRepository.findAll();
        }

        public Optional<UserModel> findOneById(Long id) {
                return userRepository.findById(id);
        }

    public UserModel atualizarCadastro(Long id, UserModel novosDados) {
        Optional<UserModel> usuarioOpt = userRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        UserModel usuario = usuarioOpt.get();

        usuario.setNome(novosDados.getNome());
        usuario.setSobrenome(novosDados.getSobrenome());
        usuario.setEmail(novosDados.getEmail());
        usuario.setEndereco(novosDados.getEndereco());
        usuario.setDataNascimento(novosDados.getDataNascimento());

        return userRepository.save(usuario);
    }

    public UserModel informarAfastamento(Long id, String motivo, LocalDate inicio, LocalDate fim) {
        Optional<UserModel> usuarioOpt = userRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        UserModel usuario = usuarioOpt.get();
        usuario.setMotivoAfastamento(motivo);
        usuario.setDataInicioAfastamento(inicio);
        usuario.setDataFimAfastamento(fim);

        return userRepository.save(usuario);
    }
}
