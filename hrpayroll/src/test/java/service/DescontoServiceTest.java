package service;

import com.example.hrpayroll.model.DescontosModel;
import com.example.hrpayroll.repository.DescontosRepository;
import com.example.hrpayroll.service.DescontosService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DescontosServiceTest {

    @Mock
    private DescontosRepository descontosRepository;

    @InjectMocks
    private DescontosService descontosService;

    private DescontosModel desconto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        desconto = new DescontosModel();
        desconto.setId(1L);
        desconto.setAtivo(true);
    }

    @Test
    void deveListarTodos() {
        when(descontosRepository.findAll()).thenReturn(List.of(desconto));

        List<DescontosModel> lista = descontosService.listarTodos();

        assertEquals(1, lista.size());
        verify(descontosRepository, times(1)).findAll();
    }

    @Test
    void deveListarAtivos() {
        when(descontosRepository.findByAtivoTrue()).thenReturn(List.of(desconto));

        List<DescontosModel> lista = descontosService.listarAtivos();

        assertFalse(lista.isEmpty());
        verify(descontosRepository).findByAtivoTrue();
    }

    @Test
    void deveBuscarPorId() {
        when(descontosRepository.findById(1L)).thenReturn(Optional.of(desconto));

        Optional<DescontosModel> resultado = descontosService.buscarPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals(1L, resultado.get().getId());
    }

    @Test
    void deveSalvarDesconto() {
        when(descontosRepository.save(desconto)).thenReturn(desconto);

        DescontosModel salvo = descontosService.salvar(desconto);

        assertNotNull(salvo);
        verify(descontosRepository).save(desconto);
    }

    @Test
    void deveAtualizarDescontoExistente() {
        when(descontosRepository.existsById(1L)).thenReturn(true);
        when(descontosRepository.save(desconto)).thenReturn(desconto);

        DescontosModel atualizado = descontosService.atualizar(1L, desconto);

        assertEquals(1L, atualizado.getId());
        verify(descontosRepository).save(desconto);
    }

    @Test
    void deveLancarErroAoAtualizarDescontoInexistente() {
        when(descontosRepository.existsById(1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> descontosService.atualizar(1L, desconto));
    }

    @Test
    void deveDeletarDesconto() {
        doNothing().when(descontosRepository).deleteById(1L);

        descontosService.deletar(1L);

        verify(descontosRepository).deleteById(1L);
    }

    @Test
    void deveInativarDesconto() {
        when(descontosRepository.findById(1L)).thenReturn(Optional.of(desconto));
        when(descontosRepository.save(any())).thenReturn(desconto);

        descontosService.inativar(1L);

        assertFalse(desconto.getAtivo());
        verify(descontosRepository).save(desconto);
    }

    @Test
    void deveCalcularINSSComSucesso() {
        when(descontosRepository.findById(1L)).thenReturn(Optional.of(desconto));
        when(descontosRepository.save(any())).thenReturn(desconto);

        descontosService.calcularINSS(1L, 3500.00);

        // verify(descontosRepository, times(1)).save(any(DescontosModel.class));
    }

    @Test
    void deveCalcularIRRFComSucesso() {
        when(descontosRepository.findById(1L)).thenReturn(Optional.of(desconto));
        when(descontosRepository.save(any())).thenReturn(desconto);

        descontosService.calcularIRRF(1L, 3500.00);

        // verify(descontosRepository, times(1)).save(any(DescontosModel.class));
    }

    @Test
    void deveCalcularSalarioComSucesso() {
        // Arrange
        Double salario = 2000.0;
        when(descontosRepository.findById(1L)).thenReturn(Optional.of(desconto));

        // Mock dos métodos internos do serviço (se não forem privados)
        DescontosService spyService = spy(descontosService);
        doReturn(200.0).when(spyService).calcularINSS(1L, salario);
        doReturn(100.0).when(spyService).calcularIRRF(1L, salario);
        doReturn(50.0).when(spyService).calcularTotalDescontos(salario);

        // Act
        Double salarioLiquido = spyService.calcularSalarioLiquido(1L, salario);

        // Assert
        Double esperado = salario - 200.0 - 100.0 - 50.0; // 1650.0
        assertEquals(esperado, salarioLiquido, 0.0001);

        verify(descontosRepository, times(1)).save(any(DescontosModel.class));
    }

    @Test
    void deveCalcularDescontoValeTransporteCorretamente() {
        DescontosService descontosService = new DescontosService();
        Double salario = 2000.0;

        Double resultado = descontosService.calcularDescontoValeTransporte(salario);

        Double esperado = 2000.0 * 0.06; // 120
        assertEquals(esperado, resultado, 0.0001);
    }

    @Test
    void deveCalcularPlanoSaudeCorretamente() {
        DescontosService descontosService = new DescontosService();
        Double salario = 2000.0;

        Double resultado = descontosService.calcularDescontoPlanoDeSaude(salario);

        Double esperado = 2000.0 * 0.03; //60
        assertEquals(esperado, resultado, 0.0001);

    }
}
