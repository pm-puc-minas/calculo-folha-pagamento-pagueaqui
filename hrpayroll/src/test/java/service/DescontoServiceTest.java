package service;

import com.example.hrpayroll.model.DescontosModel;
import com.example.hrpayroll.repository.IDescontosRepository;
import com.example.hrpayroll.service.DescontosService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DescontosServiceTest {

    @Mock
    private IDescontosRepository IDescontosRepository;

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
        when(IDescontosRepository.findAll()).thenReturn(List.of(desconto));

        List<DescontosModel> lista = descontosService.listarTodos();

        assertEquals(1, lista.size());
        verify(IDescontosRepository, times(1)).findAll();
    }

    @Test
    void deveListarAtivos() {
        when(IDescontosRepository.findByAtivoTrue()).thenReturn(List.of(desconto));

        List<DescontosModel> lista = descontosService.listarAtivos();

        assertFalse(lista.isEmpty());
        verify(IDescontosRepository).findByAtivoTrue();
    }

    @Test
    void deveBuscarPorId() {
        when(IDescontosRepository.findById(1L)).thenReturn(Optional.of(desconto));

        Optional<DescontosModel> resultado = descontosService.buscarPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals(1L, resultado.get().getId());
    }

    @Test
    void deveSalvarDesconto() {
        when(IDescontosRepository.save(desconto)).thenReturn(desconto);

        DescontosModel salvo = descontosService.salvar(desconto);

        assertNotNull(salvo);
        verify(IDescontosRepository).save(desconto);
    }

    @Test
    void deveAtualizarDescontoExistente() {
        when(IDescontosRepository.existsById(1L)).thenReturn(true);
        when(IDescontosRepository.save(desconto)).thenReturn(desconto);

        DescontosModel atualizado = descontosService.atualizar(1L, desconto);

        assertEquals(1L, atualizado.getId());
        verify(IDescontosRepository).save(desconto);
    }

    @Test
    void deveLancarErroAoAtualizarDescontoInexistente() {
        when(IDescontosRepository.existsById(1L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> descontosService.atualizar(1L, desconto));
    }

    @Test
    void deveDeletarDesconto() {
        doNothing().when(IDescontosRepository).deleteById(1L);

        descontosService.deletar(1L);

        verify(IDescontosRepository).deleteById(1L);
    }

    @Test
    void deveInativarDesconto() {
        when(IDescontosRepository.findById(1L)).thenReturn(Optional.of(desconto));
        when(IDescontosRepository.save(any())).thenReturn(desconto);

        descontosService.inativar(1L);

        assertFalse(desconto.getAtivo());
        verify(IDescontosRepository).save(desconto);
    }

    @Test
    void deveCalcularINSSComSucesso() {

        Double inss = descontosService.calcularINSS(3500.00);

        assertEquals(318.8196, inss, 0.0001);
    }

    @Test
    void deveCalcularIRRFComSucesso() {

        Double irrf = descontosService.calcularIRRF( 3500.00);

        assertEquals(40.58853, irrf, 0.0001);
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
