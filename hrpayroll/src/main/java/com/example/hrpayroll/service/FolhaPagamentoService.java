package com.example.hrpayroll.service;

import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.model.FolhaPagamentoModel;
import com.example.hrpayroll.repository.FolhaPagamentoRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FolhaPagamentoService {

    private final FolhaPagamentoRepository repository;
    private final CompanyService companyService;

    public FolhaPagamentoService(FolhaPagamentoRepository repository, CompanyService companyService) {
        this.repository = repository;
        this.companyService = companyService;
    }

    public FolhaPagamentoModel findById(Long id) {
        Optional<FolhaPagamentoModel> folhaPagamentoOptional = repository.findById(id);

        if (folhaPagamentoOptional.isPresent()) {
            return folhaPagamentoOptional.get();
        }

        return null;
    }

    public List<FolhaPagamentoModel> findAll() {
        return repository.findAll();
    }

    public List<FolhaPagamentoModel> findByCompanyId(Long companyId) {
        return repository.findByCompanyId(companyId);
    }

    public List<FolhaPagamentoModel> findByCompanyIdAndData(Long companyId, LocalDate dataInicio, LocalDate dataFim) {
        if (dataInicio.isAfter(dataFim)) {
            throw new IllegalArgumentException("Data de início deve ser anterior à data de fim.");
        }
        return repository.findByCompanyIdAndDataFolhaBetween(companyId, dataInicio, dataFim);
    }

    @Transactional
    public FolhaPagamentoModel save(FolhaPagamentoModel folha) {
        validarFolha(folha);
        return repository.save(folha);
    }

    @Transactional
    public FolhaPagamentoModel gerarNovaFolha(Long companyId, LocalDate dataInicio, LocalDate dataFim, BigDecimal salarioBase) {
        if (dataInicio.isAfter(dataFim)) {
            throw new IllegalArgumentException("Data de início deve ser anterior à data de fim.");
        }

        CompanyModel empresa = companyService.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada com ID: " + companyId));

        FolhaPagamentoModel novaFolha = new FolhaPagamentoModel();
        novaFolha.setCompany(empresa);
        novaFolha.setDataFolha(dataInicio);
        novaFolha.setValorTotal(salarioBase.multiply(BigDecimal.valueOf(1.1)));

        return save(novaFolha);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Folha de pagamento não encontrada com ID: " + id);
        }
        repository.deleteById(id);
    }

    private void validarFolha(FolhaPagamentoModel folha) {
        if (folha.getCompany() == null) {
            throw new IllegalArgumentException("Empresa é obrigatória.");
        }
        if (folha.getValorTotal() == null || folha.getValorTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor total deve ser maior que zero.");
        }
        if (folha.getDataFolha() == null || folha.getDataFolha().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Data da folha deve ser no passado ou hoje.");
        }
    }
}
