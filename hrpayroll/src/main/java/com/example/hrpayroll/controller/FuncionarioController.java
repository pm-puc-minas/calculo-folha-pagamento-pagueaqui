package com.example.hrpayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.service.FuncionarioService;
@RestController
@RequestMapping("funcionario")
public class FuncionarioController {
    @Autowired
    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @PostMapping("/create")
    public ResponseEntity createUser(@Valid @RequestBody FuncionarioModel funcionarioModel) {
        funcionarioService.create(funcionarioModel);

        return ResponseEntity.ok().build();
    }

    @GetMapping("getById/{id}")
    public ResponseEntity getUser(@Valid @PathVariable Long id) {

        FuncionarioModel funcionario = funcionarioService.findOneById(id);

        return ResponseEntity.ok(funcionario);
    }

    @GetMapping("/list")
    public ResponseEntity listUsers() {

        List<FuncionarioModel> funcioanrio = funcionarioService.list();

        return ResponseEntity.ok().body(funcioanrio);
    }
}
