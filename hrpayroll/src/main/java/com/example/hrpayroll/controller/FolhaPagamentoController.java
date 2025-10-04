package com.example.hrpayroll.controller;

import com.example.hrpayroll.service.FolhaPagamentoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/folhas")

public class FolhaPagamentoController {
        private final FolhaPagamentoService service;

        public FolhaPagamentoController(FolhaPagamentoService service) {
            this.service = service;
        }


}
