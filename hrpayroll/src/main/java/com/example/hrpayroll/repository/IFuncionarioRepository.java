package com.example.hrpayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrpayroll.model.FuncionarioModel;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface IFuncionarioRepository extends JpaRepository<FuncionarioModel, Long> {

    Optional<FuncionarioModel> findByEmail(String email);


    List<FuncionarioModel> findByCargo_Departamento_Company_Id(Long companyId);
}