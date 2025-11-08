package com.example.hrpayroll.controller;

import com.example.hrpayroll.model.FuncionarioModel;
import com.example.hrpayroll.service.CompanyService;
import com.example.hrpayroll.service.RelatorioService;
import com.itextpdf.text.DocumentException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;

@RestController
@RequestMapping("/relatorio")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/getFolhaDePagamento/{id}")
    public ResponseEntity<byte[]> gerarFolha(@PathVariable Long id) {
        try {
            var pdfStream = relatorioService.gerarRelatorioByFuncionarioId(id);

            // Definir cabeçalhos para download
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=folha_de_pagamento.pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfStream.toByteArray());
        } catch (DocumentException e) {
            // Trate o erro adequadamente
            return ResponseEntity.internalServerError().build();
        } catch (IllegalArgumentException e) {
            // Funcionário não encontrado
            return ResponseEntity.notFound().build();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
