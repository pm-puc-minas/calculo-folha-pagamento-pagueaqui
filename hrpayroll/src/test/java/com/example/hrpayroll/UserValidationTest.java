package com.example.hrpayroll;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.util.Date;
import java.util.Set;
import java.time.LocalDate;
import com.example.hrpayroll.model.FuncionarioModel;

import static org.junit.jupiter.api.Assertions.*;

class UserValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private FuncionarioModel createValidUser() {
        FuncionarioModel user = new FuncionarioModel();
        user.setNome("Maria");
        user.setSobrenome("Silva");
        user.setCpf("12345678901");
        user.setRg("MG12345678");
        user.setEmail("maria.silva@example.com");
        user.setEndereco("Rua XXXX, 123");
        user.setDataNascimento(new Date());
        user.setSenha("Senha@Forte123");
        return user;
    }

    @Test
    void whenNameBlank_thenViolation() {
        FuncionarioModel user = createValidUser();
        user.setNome("");

        Set<ConstraintViolation<FuncionarioModel>> violations = validator.validate(user);

        assertEquals(1, violations.size());                       // espera 1 violação
        ConstraintViolation<FuncionarioModel> v = violations.iterator().next();
        assertEquals("nome", v.getPropertyPath().toString());     // foi o campo nome
    }

    @Test
    void whenEmailInvalid_thenViolation() {
        FuncionarioModel user = createValidUser();
        user.setEmail("nao-email");

        Set<ConstraintViolation<FuncionarioModel>> violations = validator.validate(user);

        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }
    @Test
    void whenValidUser_thenNoViolations() {
        FuncionarioModel user = createValidUser();

        Set<ConstraintViolation<FuncionarioModel>> violations = validator.validate(user);

        assertTrue(violations.isEmpty());
    }
}