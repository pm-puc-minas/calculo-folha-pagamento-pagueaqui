package com.example.hrpayroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hrpayroll.model.DescontosModel;


@Repository
public interface DescontosRepository extends JpaRepository<DescontosModel, Long> {
    
    List<DescontosModel> findByAtivoTrue();
    
    //Uso de Generics, mas é perigoso acessar a classe de desconto dessa maneira, e se eu procurar por Desconto_INSS?
    List<DescontosModel> findByNomeContainingIgnoreCase(String nome);
}
