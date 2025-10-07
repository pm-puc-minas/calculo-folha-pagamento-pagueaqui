package com.example.hrpayroll.service;

import com.example.hrpayroll.model.UserModel;
import com.example.hrpayroll.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) 
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    // Cria uma instância real do UserService, injetando os mocks que ele precisa.
    @InjectMocks
    private UserService userService;

    private UserModel user;

    @BeforeEach
    void setUp() {
        user = new UserModel();
        user.setId(1L);
        user.setNome("Maria");
        user.setSobrenome("Silva");
        user.setEmail("maria.silva@example.com");
        user.setEndereco("Rua das Flores, 123");
        user.setDataNascimento(LocalDate.of(1990, 5, 15));
    }

    @Test
    @DisplayName("Deve criar um usuário com sucesso")
    void create_ShouldReturnSavedUser() {
        when(userRepository.save(any(UserModel.class))).thenReturn(user);

        UserModel newUser = new UserModel(); // Um novo usuário sem ID
        newUser.setNome("Maria");
        UserModel savedUser = userService.create(newUser);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isEqualTo(1L);
        verify(userRepository, times(1)).save(any(UserModel.class)); // Verifica se o save foi chamado exatamente 1 vez.
    }

    @Test
    @DisplayName("Deve listar todos os usuários")
    void list_ShouldReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(user, new UserModel()));

        List<UserModel> users = userService.list();

        assertThat(users).isNotNull();
        assertThat(users).hasSize(2);
    }

    @Test
    @DisplayName("Deve encontrar um usuário pelo ID com sucesso")
    void findOneById_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<UserModel> foundUser = userService.findOneById(1L);

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Não deve encontrar um usuário com ID inexistente")
    void findOneById_WhenUserDoesNotExist_ShouldReturnEmpty() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<UserModel> foundUser = userService.findOneById(99L);

        assertThat(foundUser).isEmpty();
    }


    @Test
    @DisplayName("Deve atualizar o cadastro de um usuário existente")
    void atualizarCadastro_WhenUserExists_ShouldReturnUpdatedUser() {
        UserModel novosDados = new UserModel();
        novosDados.setNome("Maria Joaquina");
        novosDados.setEmail("maria.joaquina@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(UserModel.class))).thenReturn(user); // O save retorna o obj modificado

        UserModel updatedUser = userService.atualizarCadastro(1L, novosDados);

        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getNome()).isEqualTo("Maria Joaquina");
        assertThat(updatedUser.getEmail()).isEqualTo("maria.joaquina@example.com");
        verify(userRepository).save(user); // Verifica se o save foi chamado com o 'user'
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar atualizar um usuário inexistente")
    void atualizarCadastro_WhenUserDoesNotExist_ShouldThrowException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.atualizarCadastro(99L, new UserModel());
        });

        assertEquals("Usuário não encontrado.", exception.getMessage());
        verify(userRepository, never()).save(any()); // Garante que o save nunca foi chamado
    }

    @Test
    @DisplayName("Deve informar o afastamento de um usuário com sucesso")
    void informarAfastamento_WhenUserExists_ShouldUpdateAbsenceInfo() {
        String motivo = "Licença Médica";
        LocalDate inicio = LocalDate.now();
        LocalDate fim = LocalDate.now().plusDays(10);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(UserModel.class))).thenReturn(user);

        UserModel updatedUser = userService.informarAfastamento(1L, motivo, inicio, fim);

        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getMotivoAfastamento()).isEqualTo(motivo);
        assertThat(updatedUser.getDataInicioAfastamento()).isEqualTo(inicio);
        assertThat(updatedUser.getDataFimAfastamento()).isEqualTo(fim);
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar informar afastamento para usuário inexistente")
    void informarAfastamento_WhenUserDoesNotExist_ShouldThrowException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.informarAfastamento(99L, "Férias", LocalDate.now(), LocalDate.now());
        });

        assertEquals("Usuário não encontrado.", exception.getMessage());
    }
}