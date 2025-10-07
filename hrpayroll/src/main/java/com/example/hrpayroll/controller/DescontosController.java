package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.DescontosModel;
import com.example.hrpayroll.service.DescontosService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/descontos")
public class DescontosController {

    @Autowired
    private DescontosService descontosService;

    @GetMapping
    public ResponseEntity<List<DescontosModel>> listarTodos() {
        return ResponseEntity.ok(descontosService.listarTodos());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<DescontosModel>> listarAtivos() {
        return ResponseEntity.ok(descontosService.listarAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DescontosModel> buscarPorId(@PathVariable Long id) {
        return descontosService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DescontosModel> criar(@Valid @RequestBody DescontosModel desconto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(descontosService.salvar(desconto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DescontosModel> atualizar(
            @PathVariable Long id, 
            @Valid @RequestBody DescontosModel desconto) {
        return ResponseEntity.ok(descontosService.atualizar(id, desconto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        descontosService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        descontosService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
