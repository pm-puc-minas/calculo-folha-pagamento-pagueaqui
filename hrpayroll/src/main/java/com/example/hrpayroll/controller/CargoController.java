package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.CargoModel;
import com.example.hrpayroll.model.DepartamentoModel;
import com.example.hrpayroll.service.CargoService;
import com.example.hrpayroll.service.CompanyService;
import com.example.hrpayroll.service.DepartamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cargo")
public class CargoController {

    @Autowired
    private CargoService cargoService;

    public CargoController(CargoService cargoService) {
        this.cargoService = cargoService;
    }

    @PostMapping("/create")
    public ResponseEntity<CargoModel> criar(@Valid @RequestBody CargoModel cargoModel) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cargoService.create(cargoModel));
    }

    @GetMapping("/list")
    public ResponseEntity<List<CargoModel>> listar() {
        List<CargoModel> list = cargoService.listar();

        return ResponseEntity.status(HttpStatus.OK)
                .body(list);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<CargoModel> findById(@PathVariable Long id) {
        CargoModel cargo = cargoService.findById(id);

        return ResponseEntity.status(HttpStatus.OK)
                .body(cargo);
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<CargoModel> deletar(@PathVariable Long id) {
        cargoService.deleteById(id);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/${id}/status")
    public ResponseEntity<CargoModel> atualizarStatus(@PathVariable Long id, @RequestParam boolean ativo) {
        CargoModel cargo = cargoService.atualizarStatus(id, ativo);

        return ResponseEntity.status(HttpStatus.OK).body(cargo);
    }


}
