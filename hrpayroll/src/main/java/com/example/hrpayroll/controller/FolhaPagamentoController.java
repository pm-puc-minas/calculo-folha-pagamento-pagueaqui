package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.FolhaPagamentoModel;
import com.example.hrpayroll.service.FolhaPagamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/folhas")

public class FolhaPagamentoController {
        private final FolhaPagamentoService service;

        public FolhaPagamentoController(FolhaPagamentoService service) {
            this.service = service;
        }

        @GetMapping()
        public List<FolhaPagamentoModel> listarTodas() {
            return service.findAll();
        }
        @GetMapping ("/{id}")
        public Optional<FolhaPagamentoModel> buscarPorId (@PathVariable Long id){
            return service.findById(id);
        }
        @PostMapping("/create")
        public ResponseEntity<FolhaPagamentoModel> criar (@RequestBody FolhaPagamentoModel folha) {
            FolhaPagamentoModel salva = service.save(folha);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        }

        @GetMapping ("/empresa/{companyId}")
        public List<FolhaPagamentoModel> buscarPorEmpresa(@PathVariable Long companyId) {
            return service.findByCompanyId(companyId);
        }
        @PostMapping("/gerar/{companyId}")
        public ResponseEntity<FolhaPagamentoModel> gerarNovaFolha(
            @PathVariable Long companyId,
            @RequestParam LocalDate dataInicio,
            @RequestParam LocalDate dataFim,
            @RequestParam BigDecimal salarioBase) {
        FolhaPagamentoModel nova = service.gerarNovaFolha(companyId, dataInicio, dataFim, salarioBase);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    }

}
