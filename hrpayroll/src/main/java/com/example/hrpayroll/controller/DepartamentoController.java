package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.CargoModel;
import com.example.hrpayroll.model.DepartamentoModel;
import com.example.hrpayroll.model.DescontosModel;
import com.example.hrpayroll.service.DepartamentoService;
import com.example.hrpayroll.service.FolhaPagamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departamento")
public class DepartamentoController {

    @Autowired
    private DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @PostMapping("/create")
    public ResponseEntity<DepartamentoModel> criar(@Valid @RequestBody DepartamentoModel departamento) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(departamentoService.create(departamento));
    }


    @GetMapping("/list")
    public ResponseEntity<List<DepartamentoModel>> listar() {
        List<DepartamentoModel> list = departamentoService.listar();

        return ResponseEntity.status(HttpStatus.OK)
                .body(list);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<DepartamentoModel> findById(@PathVariable Long id) {
        DepartamentoModel departamentoModel = departamentoService.findById(id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(departamentoModel);
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<CargoModel> deleteById(@PathVariable Long id) {
        departamentoService.deleteById(id);

        return ResponseEntity.ok().build();
    }


}
