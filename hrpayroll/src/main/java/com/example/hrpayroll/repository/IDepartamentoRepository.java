package com.example.hrpayroll.repository;

import com.example.hrpayroll.model.DepartamentoModel;
import com.example.hrpayroll.model.DescontosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IDepartamentoRepository extends JpaRepository<DepartamentoModel, Long> {
}