package com.example.hrpayroll.service;

import com.example.hrpayroll.model.FuncionarioModel;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;

@Service
public class RelatorioService {

    private FuncionarioService funcionarioService;

    public RelatorioService(FuncionarioService funcionarioService) {}

    public void gerarRelatorioByFuncionarioId(Long funcionarioId) throws FileNotFoundException, DocumentException {

        FuncionarioModel funcionario = funcionarioService.findOneById(funcionarioId);


        Document document = new Document();

        PdfWriter.getInstance(document, new FileOutputStream("folha_de_pagamento.pdf"));
        document.open();

        Font tituloFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
        Font textFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);

        document.add(new Paragraph("Folha de pagamento", tituloFont));
        document.add(new Paragraph("Nome: " + funcionario.getNome(), textFont));

        document.close();

    }

}
