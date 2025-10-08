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
        private final FolhaPagamentoService folhaPagamentoService;

        public FolhaPagamentoController(FolhaPagamentoService folhaPagamentoService) {
            this.folhaPagamentoService = folhaPagamentoService;
        }

        @GetMapping()
        public List<FolhaPagamentoModel> listarTodas() {
            return folhaPagamentoService.findAll();
        }

        @GetMapping ("/{id}")
        public ResponseEntity buscarPorId (@PathVariable Long id){
            FolhaPagamentoModel folhaPagamentoModel = folhaPagamentoService.findById(id);

            return ResponseEntity.ok(folhaPagamentoModel);
        }

        @PostMapping("/create")
        public ResponseEntity criar (@RequestBody FolhaPagamentoModel folha) {
            FolhaPagamentoModel salva = folhaPagamentoService.save(folha);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        }

        @GetMapping ("/empresa/{companyId}")
        public ResponseEntity buscarPorEmpresa(@PathVariable Long companyId) {

            List<FolhaPagamentoModel> folhaPagamento = folhaPagamentoService.findByCompanyId(companyId);

            return ResponseEntity.ok().body(folhaPagamento);

        }

        @PostMapping("/gerar/{companyId}")
        public ResponseEntity<FolhaPagamentoModel> gerarNovaFolha(
            @PathVariable Long companyId,
            @RequestParam LocalDate dataInicio,
            @RequestParam LocalDate dataFim,
            @RequestParam BigDecimal salarioBase) {
        FolhaPagamentoModel nova = folhaPagamentoService.gerarNovaFolha(companyId, dataInicio, dataFim, salarioBase);
        return ResponseEntity.status(HttpStatus.CREATED).body(nova);
    }

}
