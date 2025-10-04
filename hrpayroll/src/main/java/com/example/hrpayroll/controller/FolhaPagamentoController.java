package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.model.FolhaPagamentoModel;
import com.example.hrpayroll.service.FolhaPagamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folhas")

public class FolhaPagamentoController {
        private final FolhaPagamentoService service;

        public FolhaPagamentoController(FolhaPagamentoService service) {
            this.service = service;
        }

        @GetMapping
        public List<FolhaPagamentoModel> listarTodas() {
            return service.findAll();
        }
        @GetMapping ("/{id}")
        public ResponseEntity<FolhaPagamentoModel> buscarPorId (@PathVariable Long id){
            return service.findById(id);
        }
        @PostMapping
        public ResponseEntity<FolhaPagamentoModel> criar (@RequestBody FolhaPagamentoModel folha) {
            FolhaPagamentoModel salva = service.salva(folha);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        }
        @GetMapping ("/empresa/{companyId}")
        public List<CompanyModel> findCompanyId() {
            return service.findId(id);
        }

}
