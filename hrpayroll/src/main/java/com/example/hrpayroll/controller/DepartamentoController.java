package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.DepartamentoModel;
import com.example.hrpayroll.model.DescontosModel;
import com.example.hrpayroll.service.DepartamentoService;
import com.example.hrpayroll.service.FolhaPagamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/departamento")
public class DepartamentoController {

    @Autowired
    private DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @PostMapping
    public ResponseEntity<DepartamentoModel> criar(@Valid @RequestBody DepartamentoModel departamento) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departamentoService.create(departamento));
    }

}
