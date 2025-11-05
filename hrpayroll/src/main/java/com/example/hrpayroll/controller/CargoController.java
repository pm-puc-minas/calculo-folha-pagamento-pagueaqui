package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.DepartamentoModel;
import com.example.hrpayroll.service.DepartamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class CargoController {

    @Autowired
    private DepartamentoService departamentoService;


    @PostMapping
    public ResponseEntity<DepartamentoModel> criar(@Valid @RequestBody DepartamentoModel departamento) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departamentoService.create(departamento));
    }

}
