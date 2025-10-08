package com.example.hrpayroll.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.service.UserService;
@RestController
public class UserController {
    @Autowired
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users/create")
    public ResponseEntity createUser(@Valid @RequestBody FuncionarioModel funcionarioModel) {
        userService.create(funcionarioModel);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity getUser(@Valid @PathVariable Long id) {

        FuncionarioModel funcionario = userService.findOneById(id);

        return ResponseEntity.ok(funcionario);
    }

    @GetMapping("/users")
    public ResponseEntity listUsers() {

        List<FuncionarioModel> funcioanrio = userService.list();

        return ResponseEntity.ok().body(funcioanrio);
    }
}
