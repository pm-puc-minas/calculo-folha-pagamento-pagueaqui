package com.example.hrpayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrpayroll.model.FuncionarioModel;

public interface IFuncionarioRepository extends JpaRepository<FuncionarioModel, Long>{}
