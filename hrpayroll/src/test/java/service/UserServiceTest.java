package com.example.hrpayroll.service;

import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Date;
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

    private FuncionarioModel user;

    @BeforeEach
    void setUp() {
        user = new FuncionarioModel();
        user.setId(1L);
        user.setNome("Maria");
        user.setSobrenome("Silva");
        user.setEmail("maria.silva@example.com");
        user.setEndereco("Rua das Flores, 123");
        user.setDataNascimento(new Date());
    }

    @Test
    @DisplayName("Deve criar um usuário com sucesso")
    void create_ShouldReturnSavedUser() {
        when(userRepository.save(any(FuncionarioModel.class))).thenReturn(user);

        FuncionarioModel newUser = new FuncionarioModel(); // Um novo usuário sem ID
        newUser.setNome("Maria");
        FuncionarioModel savedUser = userService.create(newUser);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isEqualTo(1L);
        verify(userRepository, times(1)).save(any(FuncionarioModel.class)); // Verifica se o save foi chamado exatamente 1 vez.
    }

    @Test
    @DisplayName("Deve listar todos os usuários")
    void list_ShouldReturnAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(user, new FuncionarioModel()));

        List<FuncionarioModel> users = userService.list();

        assertThat(users).isNotNull();
        assertThat(users).hasSize(2);
    }

    @Test
    @DisplayName("Deve encontrar um usuário pelo ID com sucesso")
    void findOneById_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        FuncionarioModel foundUser = userService.findOneById(1L);

        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Não deve encontrar um usuário com ID inexistente")
    void findOneById_WhenUserDoesNotExist_ShouldReturnEmpty() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        FuncionarioModel foundUser = userService.findOneById(99L);

        assertThat(foundUser).isNull();
    }


    @Test
    @DisplayName("Deve atualizar o cadastro de um usuário existente")
    void atualizarCadastro_WhenUserExists_ShouldReturnUpdatedUser() {
        FuncionarioModel novosDados = new FuncionarioModel();
        novosDados.setNome("Maria Joaquina");
        novosDados.setEmail("maria.joaquina@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(FuncionarioModel.class))).thenReturn(user); // O save retorna o obj modificado

        FuncionarioModel updatedUser = userService.atualizarCadastro(1L, novosDados);

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
            userService.atualizarCadastro(99L, new FuncionarioModel());
        });

        assertEquals("Usuário não encontrado.", exception.getMessage());
        verify(userRepository, never()).save(any()); // Garante que o save nunca foi chamado
    }
}