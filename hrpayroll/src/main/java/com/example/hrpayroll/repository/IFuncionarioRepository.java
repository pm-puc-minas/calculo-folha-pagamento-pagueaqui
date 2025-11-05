package com.example.hrpayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrpayroll.model.FuncionarioModel;
import org.springframework.stereotype.Repository;

@Repository
public interface IFuncionarioRepository extends JpaRepository<FuncionarioModel, Long>{}
