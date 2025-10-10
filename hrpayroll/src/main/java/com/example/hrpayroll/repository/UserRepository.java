package com.example.hrpayroll.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrpayroll.model.FuncionarioModel;

public interface UserRepository extends JpaRepository<FuncionarioModel, Long>{
    Optional<FuncionarioModel> findByEmail(String email);
    Optional<FuncionarioModel> findByCpf(String cpf);
}
