package com.example.hrpayroll.repository;

import com.example.hrpayroll.model.DescontosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DescontosRepository extends JpaRepository<DescontosModel, Long> {
    
    List<DescontosModel> findByAtivoTrue();
    
    List<DescontosModel> findByNomeContainingIgnoreCase(String nome);
}
