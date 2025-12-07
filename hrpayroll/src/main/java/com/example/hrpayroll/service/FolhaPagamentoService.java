package com.example.hrpayroll.service;

import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.model.FolhaItemModel;
import com.example.hrpayroll.model.FolhaPagamentoModel;
import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.model.TipoItemFolha;
import com.example.hrpayroll.repository.IFolhaPagamentoRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FolhaPagamentoService {

    private final IFolhaPagamentoRepository repository;
    private final CompanyService companyService;
    private final FuncionarioService funcionarioService;

    public FolhaPagamentoService(
            IFolhaPagamentoRepository repository,
            CompanyService companyService,
            FuncionarioService funcionarioService
    ) {
        this.repository = repository;
        this.companyService = companyService;
        this.funcionarioService = funcionarioService;
    }

    // ... (MÉTODOS FIND ORIGINAIS MANTIDOS) ...
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

    // MÉTODO REESCRITO PARA USAR A NOVA ESTRUTURA DE FOLHAITEM
    @Transactional
    public FolhaPagamentoModel gerarNovaFolha(Long companyId, LocalDate dataInicio, LocalDate dataFim, BigDecimal salarioBaseTotal) {
        if (dataInicio.isAfter(dataFim)) {
            throw new IllegalArgumentException("Data de início deve ser anterior à data de fim.");
        }

        CompanyModel empresa = companyService.findById(companyId);
        FolhaPagamentoModel novaFolha = new FolhaPagamentoModel();
        novaFolha.setCompany(empresa);
        novaFolha.setDataFolha(dataInicio);

        BigDecimal totalGeralProventos = BigDecimal.ZERO;
        BigDecimal totalGeralDescontos = BigDecimal.ZERO;

        List<FuncionarioModel> funcionarios = funcionarioService.findByCompanyId(companyId);

        if (funcionarios.isEmpty()) {
            throw new RuntimeException("Nenhum funcionário encontrado para a empresa. Impossível gerar folha.");
        }

        for (FuncionarioModel funcionario : funcionarios) {

            // OBTÉM OS ITENS CALCULADOS (PROVENTOS E DESCONTOS)
            List<FuncionarioService.ItemCalculadoDTO> itensFuncionario = funcionarioService.getCalculoDetalhado(funcionario.getId());

            // ADICIONA OS ITENS CALCULADOS À FOLHA PRINCIPAL E SOMA OS TOTAIS
            for (FuncionarioService.ItemCalculadoDTO itemDTO : itensFuncionario) {
                FolhaItemModel novoItem = new FolhaItemModel();
                novoItem.setFolhaPagamento(novaFolha);
                novoItem.setTipo(itemDTO.getTipo());
                // Identifica o funcionário no item
                novoItem.setDescricao(funcionario.getNome() + " " + funcionario.getSobrenome() + " - " + itemDTO.getDescricao());
                novoItem.setValor(itemDTO.getValor());

                novaFolha.getItens().add(novoItem);

                if (itemDTO.getTipo() == TipoItemFolha.PROVENTO) {
                    totalGeralProventos = totalGeralProventos.add(itemDTO.getValor());
                } else if (itemDTO.getTipo() == TipoItemFolha.DESCONTO) {
                    totalGeralDescontos = totalGeralDescontos.add(itemDTO.getValor());
                }
            }
        }

        // FINALIZAÇÃO DA FOLHA DE PAGAMENTO (TOTAIS)
        BigDecimal valorTotalLiquido = totalGeralProventos.subtract(totalGeralDescontos);

        novaFolha.setValorTotal(valorTotalLiquido.setScale(2, RoundingMode.HALF_UP));
        novaFolha.setSalarioBase(totalGeralProventos.setScale(2, RoundingMode.HALF_UP)); // Usado para total de proventos
        novaFolha.setNumeroHorasTrabalhadas(0);

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