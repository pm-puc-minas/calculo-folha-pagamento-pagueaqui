package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.FolhaItemModel;
import com.example.hrpayroll.service.FolhaItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folha-item")
@Tag(name = "Folha de Pagamento - Itens", description = "Endpoints para gerenciamento de itens individuais de folha (proventos e descontos)")
public class FolhaItemController {

    @Autowired
    private FolhaItemService folhaItemService;

    @Operation(summary = "Lista todos os itens de folha cadastrados")
    @GetMapping("/list")
    public ResponseEntity<List<FolhaItemModel>> getAllFolhaItems() {
        return ResponseEntity.ok(folhaItemService.findAll());
    }
}