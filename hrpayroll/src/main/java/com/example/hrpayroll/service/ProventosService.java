package com.example.hrpayroll.service;

import com.example.hrpayroll.model.ProventosModel;
import com.example.hrpayroll.repository.IProventosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProventosService {

    @Autowired
    private IProventosRepository iProventosRepository;

     public ProventosService(IProventosRepository iProventosRepository) {
         this.iProventosRepository = iProventosRepository;
     }

     public ProventosModel create(ProventosModel proventosModel) {
         return this.iProventosRepository.save(proventosModel);
     }

     public ProventosModel findByFuncionarioId(Long funcionarioId) {
         return iProventosRepository.findByFuncionarioId(funcionarioId);
     }

    public void updateHorasExtras(Long funcionarioId, Long horasExtras) {
         ProventosModel proventosModel = findByFuncionarioId(funcionarioId);
         proventosModel.setHorasExtras(horasExtras);

         iProventosRepository.save(proventosModel);
    }

    public void updateAdicionalNoturno(Long funcionarioId, Boolean adicionalNoturno) {
        ProventosModel proventosModel = findByFuncionarioId(funcionarioId);
        proventosModel.setAdicionalNoturno(adicionalNoturno);

        iProventosRepository.save(proventosModel);

    }

    public void updateAdicionalInsalubridade(Long funcionarioId, Boolean adicionalInsalubridade) {
        ProventosModel proventosModel = findByFuncionarioId(funcionarioId);
        proventosModel.setAdicionalInsalubridade(adicionalInsalubridade);

        iProventosRepository.save(proventosModel);
    }

    public void updateAdicionalPericulosidade(Long funcionarioId, Boolean adicionalPericulosidade) {
        ProventosModel proventosModel = findByFuncionarioId(funcionarioId);
        proventosModel.setAdicionalPericulosidade(adicionalPericulosidade);

        iProventosRepository.save(proventosModel);
    }

    public void updateValeTransporte(Long funcionarioId, Boolean valeTransporte) {
        ProventosModel proventosModel = findByFuncionarioId(funcionarioId);
        proventosModel.setValeTransporte(valeTransporte);

        iProventosRepository.save(proventosModel);
    }

    public void updateValeAlimentacaoRefeicao(Long funcionarioId, Boolean valeAlimentacaoRefeicao) {
        ProventosModel proventosModel = findByFuncionarioId(funcionarioId);
        proventosModel.setValeAlimentacaoRefeicao(valeAlimentacaoRefeicao);

        iProventosRepository.save(proventosModel);
    }

    public void updatePlanoDeSaude(Long funcionarioId, Boolean planoDeSaude) {
        ProventosModel proventosModel = findByFuncionarioId(funcionarioId);
        proventosModel.setPlanoDeSaude(planoDeSaude);

        iProventosRepository.save(proventosModel);
    }
}
