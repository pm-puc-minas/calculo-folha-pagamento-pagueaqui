package service;

import com.example.hrpayroll.model.CargoModel;
import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.model.ProventosModel;
import com.example.hrpayroll.repository.IFuncionarioRepository;
import com.example.hrpayroll.service.*;
import com.example.hrpayroll.service.BankInfoService; // Importação necessária

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FuncionarioServiceTest {

    @Mock
    private IFuncionarioRepository IFuncionarioRepository;

    // Dependências necessárias para o FuncionarioService
    @Mock
    private DescontosService descontoService;
    @Mock
    private AdicionalService adicionalService;
    @Mock
    private CargoService cargoService;
    @Mock
    private ProventosService proventosService;

    @Mock
    private BankInfoService bankInfoService;

    // Cria uma instância real do UserService, injetando os mocks.
    @InjectMocks
    private FuncionarioService funcionarioService;

    private FuncionarioModel user;

    @BeforeEach
    void setUp() {
        user = new FuncionarioModel();
        user.setId(1L);
        user.setNome("Maria");
        user.setSobrenome("Silva");
        user.setEmail("maria.silva@example.com");
        user.setDataDeNascimento(new Date());
    }

    @Test
    @DisplayName("Deve listar todos os usuários")
    void list_ShouldReturnAllUsers() {
        when(IFuncionarioRepository.findAll()).thenReturn(List.of(user, new FuncionarioModel()));

        List<FuncionarioModel> users = funcionarioService.list();

        assertThat(users).isNotNull();
        assertThat(users).hasSize(2);
    }

    @Test
    @DisplayName("Deve encontrar um usuário pelo ID com sucesso")
    void findOneById_WhenUserExists_ShouldReturnUser() {
        when(IFuncionarioRepository.findById(1L)).thenReturn(Optional.of(user));

        FuncionarioModel foundUser = funcionarioService.findOneById(1L);

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Não deve encontrar um usuário com ID inexistente")
    void findOneById_WhenUserDoesNotExist_ShouldReturnEmpty() {
        when(IFuncionarioRepository.findById(99L)).thenReturn(Optional.empty());

        FuncionarioModel foundUser = funcionarioService.findOneById(99L);

        assertThat(foundUser).isNull();
    }


    @Test
    @DisplayName("Deve atualizar o cadastro de um usuário existente")
    void atualizarCadastro_WhenUserExists_ShouldReturnUpdatedUser() {
        FuncionarioModel novosDados = new FuncionarioModel();
        novosDados.setNome("Maria Joaquina");
        novosDados.setEmail("maria.joaquina@example.com");

        when(IFuncionarioRepository.findById(1L)).thenReturn(Optional.of(user));
        when(IFuncionarioRepository.save(any(FuncionarioModel.class))).thenReturn(user); // O save retorna o obj modificado

        FuncionarioModel updatedUser = funcionarioService.atualizarCadastro(1L, novosDados);

        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getNome()).isEqualTo("Maria Joaquina");
        assertThat(updatedUser.getEmail()).isEqualTo("maria.joaquina@example.com");
        verify(IFuncionarioRepository).save(user); // Verifica se o save foi chamado com o 'user'
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar atualizar um usuário inexistente")
    void atualizarCadastro_WhenUserDoesNotExist_ShouldThrowException() {
        when(IFuncionarioRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            funcionarioService.atualizarCadastro(99L, new FuncionarioModel());
        });

        assertEquals("Usuário não encontrado.", exception.getMessage());
        verify(IFuncionarioRepository, never()).save(any()); // Garante que o save nunca foi chamado
    }

    @Test
    @DisplayName("Cálculo do Salário Líquido (INSS com Decorator) deve retornar o valor correto")
    void calcularSalarioLiquidoComDecoratorINSS_deveManterResultadoCorreto() {
        final Long ID_FUNCIONARIO = 1L;
        final Double SALARIO_BASE = 5000.00;

        // Valores Mockados
        final Double VALOR_INSS = 600.00;
        final Double VALOR_IRRF = 350.00;
        final Double DESCONTO_PLANO_SAUDE = 150.00;
        final Double DESCONTO_VALE_TRANSPORTE = 300.00;

        // Mocks das Entidades
        FuncionarioModel funcionarioMock = mock(FuncionarioModel.class);
        CargoModel cargoMock = mock(CargoModel.class);
        ProventosModel proventosMock = mock(ProventosModel.class);

        // Configuração do Funcionário e Cargo
        when(IFuncionarioRepository.findById(ID_FUNCIONARIO)).thenReturn(Optional.of(funcionarioMock));
        when(funcionarioMock.getCargo()).thenReturn(cargoMock);
        when(funcionarioMock.getProventos()).thenReturn(proventosMock);
        when(cargoMock.getSalarioBase()).thenReturn(SALARIO_BASE);

        // Configuração dos Proventos ativados
        when(proventosMock.getValeTransporte()).thenReturn(true);
        when(proventosMock.getPlanoDeSaude()).thenReturn(true);
        // Configurações desativadas/zero para simplificar a conta
        when(proventosMock.getAdicionalNoturno()).thenReturn(false);
        when(proventosMock.getAdicionalInsalubridade()).thenReturn(false);
        when(proventosMock.getAdicionalPericulosidade()).thenReturn(false);
        when(proventosMock.getValeAlimentacaoRefeicao()).thenReturn(false);
        when(proventosMock.getHorasExtras()).thenReturn(0L);

        // O Decorator (INSS) e o restante do código consomem esses valores mockados.
        when(descontoService.calcularINSS(SALARIO_BASE)).thenReturn(VALOR_INSS);
        when(descontoService.calcularIRRF(SALARIO_BASE)).thenReturn(VALOR_IRRF);
        when(descontoService.calcularDescontoPlanoDeSaude(SALARIO_BASE)).thenReturn(DESCONTO_PLANO_SAUDE);
        when(descontoService.calcularDescontoValeTransporte(SALARIO_BASE)).thenReturn(DESCONTO_VALE_TRANSPORTE);

        Double salarioLiquido = funcionarioService.salarioLiquidoById(ID_FUNCIONARIO);


        // 5000.00 (Base) - 600.00 (INSS - via Decorator) - 350.00 (IRRF) - 300.00 (VT) - 150.00 (Plano de Saúde)
        Double resultadoEsperado = 5000.00 - 600.00 - 350.00 - 300.00 - 150.00; // = 3600.00

        assertEquals(resultadoEsperado, salarioLiquido, 0.001, "O salário líquido calculado deve ser 3600.00.");

        verify(descontoService, times(1)).calcularINSS(SALARIO_BASE);
    }
}