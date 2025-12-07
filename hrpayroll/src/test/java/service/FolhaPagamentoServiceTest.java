package service;

import com.example.hrpayroll.model.*;
import com.example.hrpayroll.repository.IFolhaPagamentoRepository;
import com.example.hrpayroll.service.CompanyService;
import com.example.hrpayroll.service.FolhaPagamentoService;
import com.example.hrpayroll.service.FuncionarioService; // Importação NOVO

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FolhaPagamentoServiceTest {
    @Mock
    private IFolhaPagamentoRepository repository;

    @Mock
    private CompanyService companyService;

    @Mock // <--- ADICIONADO: Simula o FuncionarioService
    private FuncionarioService funcionarioService;

    @InjectMocks
    private FolhaPagamentoService folhaPagamentoService;

    private CompanyModel empresa;
    private FuncionarioModel funcionario;
    private List<FuncionarioModel> funcionariosMockList;

    @BeforeEach
    void setUp() {
        // Inicializa Mocks e injeta no folhaPagamentoService
        MockitoAnnotations.openMocks(this);

        empresa = new CompanyModel();
        empresa.setId(1L);
        empresa.setCnpj("12.345.678/0001-90");
        empresa.setRazaoSocial("Empresa Teste LTDA");
        empresa.setNomeFantasia("Empresa Teste");
        empresa.setInscricaoEstadual("123456789");

        // Mock de Funcionário para o teste de geração de folha
        CargoModel cargo = new CargoModel();
        cargo.setSalarioBase(1000.00);

        ProventosModel proventos = new ProventosModel();
        proventos.setSalarioBruto(BigDecimal.valueOf(1000.00));

        funcionario = new FuncionarioModel();
        funcionario.setId(1L);
        funcionario.setNome("Test");
        funcionario.setSobrenome("User");
        funcionario.setCargo(cargo);
        funcionario.setProventos(proventos);

        funcionariosMockList = Collections.singletonList(funcionario);
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
        BigDecimal salarioBaseTotal = BigDecimal.valueOf(1000.00);

        // MOCK 1: Simula que a empresa existe
        when(companyService.findById(1L)).thenReturn(empresa);

        // MOCK 2: Simula que o funcionário foi encontrado
        when(funcionarioService.findByCompanyId(1L)).thenReturn(funcionariosMockList);

        // MOCK 3: Simula o resultado do cálculo detalhado (R$1000 proventos - R$100 descontos)
        when(funcionarioService.getCalculoDetalhado(1L)).thenReturn(
                List.of(
                        new FuncionarioService.ItemCalculadoDTO("Salário Base", TipoItemFolha.PROVENTO, BigDecimal.valueOf(1000.00)),
                        new FuncionarioService.ItemCalculadoDTO("INSS", TipoItemFolha.DESCONTO, BigDecimal.valueOf(100.00))
                )
        );

        when(repository.save(any(FolhaPagamentoModel.class))).thenAnswer(i -> i.getArgument(0));

        FolhaPagamentoModel folha = folhaPagamentoService.gerarNovaFolha(1L, inicio, fim, salarioBaseTotal);

        assertNotNull(folha);
        assertEquals(empresa, folha.getCompany());
        // O valor total líquido (1000 - 100) deve ser R$900,00
        assertEquals(BigDecimal.valueOf(900.00).setScale(2, RoundingMode.HALF_UP), folha.getValorTotal());
        verify(repository, times(1)).save(any(FolhaPagamentoModel.class));
    }

    @Test
    void deveLancarExcecaoQuandoNaoHaFuncionarios() {
        LocalDate inicio = LocalDate.now().minusDays(10);
        LocalDate fim = LocalDate.now();
        BigDecimal salarioBaseTotal = BigDecimal.TEN;

        when(companyService.findById(1L)).thenReturn(empresa);
        // MOCK: Retorna uma lista vazia
        when(funcionarioService.findByCompanyId(1L)).thenReturn(Collections.emptyList());

        RuntimeException e = assertThrows(RuntimeException.class, () ->
                folhaPagamentoService.gerarNovaFolha(1L, inicio, fim, salarioBaseTotal)
        );

        assertEquals("Nenhum funcionário encontrado para a empresa. Impossível gerar folha.", e.getMessage());
        verify(repository, never()).save(any(FolhaPagamentoModel.class));
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