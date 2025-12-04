package com.example.hrpayroll.controller;

import com.example.hrpayroll.service.ProventosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/proventos")
public class ProventosController {

    @Autowired
    private ProventosService proventosService;

    @PatchMapping("/{funcionarioId}/horas-extras")
    public void updateHorasExtras(
            @PathVariable Long funcionarioId,
            @RequestParam Long horasExtras) {
        proventosService.updateHorasExtras(funcionarioId, horasExtras);
    }

    @PatchMapping("/{funcionarioId}/adicional-noturno")
    public void updateAdicionalNoturno(
            @PathVariable Long funcionarioId,
            @RequestParam Boolean adicionalNoturno) {
        proventosService.updateAdicionalNoturno(funcionarioId, adicionalNoturno);
    }

    @PatchMapping("/{funcionarioId}/adicional-insalubridade")
    public void updateAdicionalInsalubridade(
            @PathVariable Long funcionarioId,
            @RequestParam Boolean adicionalInsalubridade) {
        proventosService.updateAdicionalInsalubridade(funcionarioId, adicionalInsalubridade);
    }

    @PatchMapping("/{funcionarioId}/adicional-periculosidade")
    public void updateAdicionalPericulosidade(
            @PathVariable Long funcionarioId,
            @RequestParam Boolean adicionalPericulosidade) {
        proventosService.updateAdicionalPericulosidade(funcionarioId, adicionalPericulosidade);
    }

    @PatchMapping("/{funcionarioId}/vale-transporte")
    public void updateValeTransporte(
            @PathVariable Long funcionarioId,
            @RequestParam Boolean valeTransporte) {
        proventosService.updateValeTransporte(funcionarioId, valeTransporte);
    }

    @PatchMapping("/{funcionarioId}/vale-alimentacao-refeicao")
    public void updateValeAlimentacaoRefeicao(
            @PathVariable Long funcionarioId,
            @RequestParam Boolean valeAlimentacaoRefeicao) {
        proventosService.updateValeAlimentacaoRefeicao(funcionarioId, valeAlimentacaoRefeicao);
    }

    // Atualizar plano de saúde
    @PatchMapping("/{funcionarioId}/plano-de-saude")
    public void updatePlanoDeSaude(
            @PathVariable Long funcionarioId,
            @RequestParam Boolean planoDeSaude) {
        proventosService.updatePlanoDeSaude(funcionarioId, planoDeSaude);
    }


}
