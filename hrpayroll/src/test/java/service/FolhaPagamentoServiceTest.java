package service;

import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.model.FolhaPagamentoModel;
import com.example.hrpayroll.repository.FolhaPagamentoRepository;
import com.example.hrpayroll.service.CompanyService;
import com.example.hrpayroll.service.FolhaPagamentoService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FolhaPagamentoServiceTest {
    @Mock
    private FolhaPagamentoRepository repository;

    @Mock
    private CompanyService companyService;

    @InjectMocks
    private FolhaPagamentoService folhaPagamentoService;

    private CompanyModel empresa;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        empresa = new CompanyModel();
        empresa.setId(1L);
        empresa.setCnpj("12.345.678/0001-90");
        empresa.setRazaoSocial("Empresa Teste LTDA");
        empresa.setNomeFantasia("Empresa Teste");
        empresa.setInscricaoEstadual("123456789");
    }

    @Test
    void deveSalvarFolhaComSucesso() {
        FolhaPagamentoModel folha = new FolhaPagamentoModel();
        folha.setCompany(empresa);
        folha.setDataFolha(LocalDate.now());
        folha.setValorTotal(BigDecimal.valueOf(2500.00));

        when(repository.save(folha)).thenReturn(folha);

        FolhaPagamentoModel resultado = folhaPagamentoService.save(folha);

        assertNotNull(resultado);
        assertEquals(BigDecimal.valueOf(2500.00), resultado.getValorTotal());
        verify(repository, times(1)).save(folha);
    }

    @Test
    void deveGerarNovaFolhaComSucesso() {
        LocalDate inicio = LocalDate.now().minusDays(10);
        LocalDate fim = LocalDate.now();
        BigDecimal salarioBase = BigDecimal.valueOf(3000);

        when(companyService.findById(1L)).thenReturn(empresa);
        when(repository.save(any(FolhaPagamentoModel.class))).thenAnswer(i -> i.getArgument(0));

        FolhaPagamentoModel folha = folhaPagamentoService.gerarNovaFolha(1L, inicio, fim, salarioBase);

        assertNotNull(folha);
        assertEquals(empresa, folha.getCompany());
        assertEquals(salarioBase.multiply(BigDecimal.valueOf(1.1)), folha.getValorTotal());
        verify(repository, times(1)).save(any(FolhaPagamentoModel.class));
    }

    @Test
    void deveLancarExcecaoQuandoDataInicioDepoisDeFim() {
        LocalDate inicio = LocalDate.now();
        LocalDate fim = LocalDate.now().minusDays(5);

        Exception e = assertThrows(IllegalArgumentException.class, () ->
                folhaPagamentoService.gerarNovaFolha(1L, inicio, fim, BigDecimal.TEN)
        );

        assertEquals("Data de início deve ser anterior à data de fim.", e.getMessage());
    }

    @Test
    void deveBuscarPorIdComSucesso() {
        FolhaPagamentoModel folha = new FolhaPagamentoModel();
        folha.setId(1L);

        when(repository.findById(1L)).thenReturn(Optional.of(folha));

        FolhaPagamentoModel resultado = folhaPagamentoService.findById(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void deveExcluirFolhaQuandoExistente() {
        when(repository.existsById(1L)).thenReturn(true);

        folhaPagamentoService.deleteById(1L);

        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    void deveLancarErroAoExcluirFolhaInexistente() {
        when(repository.existsById(1L)).thenReturn(false);

        RuntimeException e = assertThrows(RuntimeException.class, () ->
                folhaPagamentoService.deleteById(1L)
        );

        assertEquals("Folha de pagamento não encontrada com ID: 1", e.getMessage());
        verify(repository, never()).deleteById(anyLong());
    }
}
