package com.example.hrpayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.hrpayroll.model.ProventosModel;

@Repository
public interface IProventosRepository extends JpaRepository<ProventosModel, Long> {

    ProventosModel findByFuncionarioId(Long funcionarioId);

}
