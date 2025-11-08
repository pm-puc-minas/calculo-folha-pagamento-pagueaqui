package com.example.hrpayroll.service;

import com.example.hrpayroll.model.FuncionarioModel;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

@Service
public class RelatorioService {

    private FuncionarioService funcionarioService;

    public RelatorioService(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    public  ByteArrayOutputStream gerarRelatorioByFuncionarioId(Long id)
            throws FileNotFoundException, DocumentException {

        FuncionarioModel funcionario = funcionarioService.findOneById(id);
        if (funcionario == null) {
            throw new IllegalArgumentException("Funcionário com ID " + id + " não encontrado.");
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        document.open();

        Font fTitulo = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
        Font fCabecalho = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
        Font fTexto = new Font(Font.FontFamily.HELVETICA, 10);
        Font fMenor = new Font(Font.FontFamily.HELVETICA, 8);

        // ======= CABEÇALHO EMPRESA =======
        PdfPTable cabecalho = new PdfPTable(2);
        cabecalho.setWidthPercentage(100);
        cabecalho.setWidths(new float[]{70, 30});
        cabecalho.addCell(cellSemBorda("RAZÃO SOCIAL LTDA\nCNPJ: XX.XXX.XXX/0001-AA", fTexto, Element.ALIGN_LEFT));
        cabecalho.addCell(cellSemBorda("FOLHA MENSAL\nABRIL DE 2024", fTexto, Element.ALIGN_RIGHT));
        document.add(cabecalho);
        document.add(new Paragraph(" ")); // espaçamento

        // ======= DADOS DO FUNCIONÁRIO =======
        PdfPTable dadosFuncionario = new PdfPTable(5);
        dadosFuncionario.setWidthPercentage(100);
        dadosFuncionario.setWidths(new float[]{10, 40, 15, 15, 20});
        dadosFuncionario.addCell(cellCabecalho("CÓD", fCabecalho));
        dadosFuncionario.addCell(cellCabecalho("NOME DO FUNCIONÁRIO", fCabecalho));
        dadosFuncionario.addCell(cellCabecalho("CBO", fCabecalho));
        dadosFuncionario.addCell(cellCabecalho("DEPTO", fCabecalho));
        dadosFuncionario.addCell(cellCabecalho("FILIAL", fCabecalho));

        dadosFuncionario.addCell(cellTexto(String.valueOf(funcionario.getId()), fTexto));
        dadosFuncionario.addCell(cellTexto(funcionario.getNome(), fTexto));
        dadosFuncionario.addCell(cellTexto("311515", fTexto)); // exemplo
        dadosFuncionario.addCell(cellTexto("1", fTexto));
        dadosFuncionario.addCell(cellTexto("1", fTexto));

        document.add(dadosFuncionario);
        document.add(new Paragraph(" "));

        // ======= TABELA DE LANÇAMENTOS =======
        PdfPTable tabela = new PdfPTable(5);
        tabela.setWidthPercentage(100);
        tabela.setWidths(new float[]{10, 45, 15, 15, 15});

        tabela.addCell(cellCabecalho("CÓDIGO", fCabecalho));
        tabela.addCell(cellCabecalho("DESCRIÇÃO", fCabecalho));
        tabela.addCell(cellCabecalho("REFERÊNCIA", fCabecalho));
        tabela.addCell(cellCabecalho("VENCIMENTO", fCabecalho));
        tabela.addCell(cellCabecalho("DESCONTOS", fCabecalho));

        // Exemplo de dados
        tabela.addCell(cellTexto("1", fTexto));
        tabela.addCell(cellTexto("HORAS NORMAIS", fTexto));
        tabela.addCell(cellTexto("220:00", fTexto));
        tabela.addCell(cellTexto("2.933,56", fTexto));
        tabela.addCell(cellTexto("-", fTexto));

        tabela.addCell(cellTexto("998", fTexto));
        tabela.addCell(cellTexto("I.N.S.S", fTexto));
        tabela.addCell(cellTexto("8,37", fTexto));
        tabela.addCell(cellTexto("-", fTexto));
        tabela.addCell(cellTexto("245,43", fTexto));

        tabela.addCell(cellTexto("8111", fTexto));
        tabela.addCell(cellTexto("DESCONTO PLANO DE SAÚDE", fTexto));
        tabela.addCell(cellTexto("88,98", fTexto));
        tabela.addCell(cellTexto("-", fTexto));
        tabela.addCell(cellTexto("88,98", fTexto));

        document.add(tabela);

        // ======= TOTAIS =======
        PdfPTable totais = new PdfPTable(2);
        totais.setWidthPercentage(40);
        totais.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totais.addCell(cellCabecalho("TOTAL VENC.", fCabecalho));
        totais.addCell(cellCabecalho("TOTAL DESC.", fCabecalho));
        totais.addCell(cellTexto("2.934,28", fTexto));
        totais.addCell(cellTexto("336,28", fTexto));
        document.add(totais);

        document.add(new Paragraph("\nVALOR LÍQUIDO: R$ 2.598,00", fCabecalho));
        document.add(new Paragraph("\n"));

        // ======= RODAPÉ =======
        PdfPTable rodape = new PdfPTable(2);
        rodape.setWidthPercentage(100);
        rodape.setWidths(new float[]{60, 40});
        rodape.addCell(cellSemBorda("SALÁRIO BASE: 2.933,56\nBASE CÁLC. FGTS: 2.933,56\nFGTS MÊS: 234,68", fMenor, Element.ALIGN_LEFT));
        rodape.addCell(cellSemBorda("DATA: ____/____/____\nASSINATURA DO FUNCIONÁRIO: ____________________", fMenor, Element.ALIGN_RIGHT));
        document.add(rodape);

        document.close();
        System.out.println("✅ Holerite gerado com sucesso!");

        return baos;
    }

    private static PdfPCell cellCabecalho(String texto, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        return cell;
    }

    private static PdfPCell cellTexto(String texto, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        return cell;
    }

    private static PdfPCell cellSemBorda(String texto, Font font, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(align);
        return cell;
    }

}
