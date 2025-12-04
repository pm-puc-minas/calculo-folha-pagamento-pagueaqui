package service;

import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.repository.IFuncionarioRepository;
import com.example.hrpayroll.service.FuncionarioService;

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

    // Cria uma instância real do UserService, injetando os mocks que ele precisa.
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

//    @Test
//    @DisplayName("Deve criar um usuário com sucesso")
//    void create_ShouldReturnSavedUser() {
//        when(IFuncionarioRepository.save(any(FuncionarioModel.class))).thenReturn(user);
//
//        FuncionarioModel newUser = new FuncionarioModel(); // Um novo usuário sem ID
//        newUser.setNome("Maria");
//        FuncionarioModel savedUser = funcionarioService.create(newUser);
//
//        assertThat(savedUser).isNotNull();
//        assertThat(savedUser.getId()).isEqualTo(1L);
//        verify(IFuncionarioRepository, times(1)).save(any(FuncionarioModel.class)); // Verifica se o save foi chamado exatamente 1 vez.
//    }

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
}