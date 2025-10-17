package com.example.hrpayroll.repository;

import com.example.hrpayroll.model.FolhaPagamentoModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IFolhaPagamentoRepository extends JpaRepository <FolhaPagamentoModel, Long> {

    List<FolhaPagamentoModel> findByCompanyId(Long companyId);

    List<FolhaPagamentoModel> findByCompanyIdAndDataFolhaBetween(Long companyId, LocalDate dataInicio, LocalDate dataFim);

}
