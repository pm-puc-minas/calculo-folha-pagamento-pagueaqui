package com.example.hrpayroll.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
    public FuncionarioModel createUser(@Valid @RequestBody FuncionarioModel funcionarioModel) {
        return userService.create(funcionarioModel);
    }

    @GetMapping("/users/{id}")
    public Optional<FuncionarioModel> getUser(@Valid @PathVariable Long id) {
        return userService.findOneById(id);
    }

    @GetMapping("/users")
    public Iterable<FuncionarioModel> listUsers() {
        return userService.list();
    }
}
