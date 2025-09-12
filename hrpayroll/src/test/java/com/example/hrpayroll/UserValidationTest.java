package com.example.hrpayroll;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.util.Set;
import com.example.hrpayroll.Model.UserModel;

import static org.junit.jupiter.api.Assertions.*;

class UserValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }
    @Test

    void whenNameBlank_thenViolation() {
        UserModel user = new UserModel();
        user.setNome("");                         // inválido
        user.setEmail("valido@example.com");      // válido

        Set<ConstraintViolation<UserModel>> violations = validator.validate(user);

        assertEquals(1, violations.size());                       // espera 1 violação
        ConstraintViolation<UserModel> v = violations.iterator().next();
        assertEquals("name", v.getPropertyPath().toString());     // foi o campo name
    }

}
