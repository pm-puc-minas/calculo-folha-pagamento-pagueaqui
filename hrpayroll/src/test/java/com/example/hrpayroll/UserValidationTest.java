package com.example.hrpayroll;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.util.Set;
import java.time.LocalDate;
import com.example.hrpayroll.model.UserModel;

import static org.junit.jupiter.api.Assertions.*;

class UserValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private UserModel createValidUser() {
        UserModel user = new UserModel();
        user.setNome("Maria");
        user.setSobrenome("Silva");
        user.setCpf("12345678901");
        user.setRg("MG12345678");
        user.setEmail("maria.silva@example.com");
        user.setEndereco("Rua XXXX, 123");
        user.setDataNascimento(LocalDate.of(1995, 10, 20));
        user.setSenha("Senha@Forte123");
        return user;
    }

    @Test
    void whenNameBlank_thenViolation() {
        UserModel user = createValidUser();
        user.setNome("");

        Set<ConstraintViolation<UserModel>> violations = validator.validate(user);

        assertEquals(1, violations.size());                       // espera 1 violação
        ConstraintViolation<UserModel> v = violations.iterator().next();
        assertEquals("nome", v.getPropertyPath().toString());     // foi o campo nome
    }

    @Test
    void whenEmailInvalid_thenViolation() {
        UserModel user = createValidUser();
        user.setEmail("nao-email");

        Set<ConstraintViolation<UserModel>> violations = validator.validate(user);

        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }
    @Test
    void whenValidUser_thenNoViolations() {
        UserModel user = createValidUser();

        Set<ConstraintViolation<UserModel>> violations = validator.validate(user);

        assertTrue(violations.isEmpty());
    }
}