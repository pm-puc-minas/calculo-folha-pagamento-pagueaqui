package com.example.hrpayroll.service;

import com.example.hrpayroll.model.DescontosModel;
import com.example.hrpayroll.repository.DescontosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DescontosService {

    @Autowired
    private DescontosRepository descontosRepository;

    public List<DescontosModel> listarTodos() {
        return descontosRepository.findAll();
    }

    public List<DescontosModel> listarAtivos() {
        return descontosRepository.findByAtivoTrue();
    }

    public Optional<DescontosModel> buscarPorId(Long id) {
        return descontosRepository.findById(id);
    }

    public DescontosModel salvar(DescontosModel desconto) {
        return descontosRepository.save(desconto);
    }

    public DescontosModel atualizar(Long id, DescontosModel desconto) {
        if (!descontosRepository.existsById(id)) {
            throw new RuntimeException("Desconto não encontrado");
        }
        desconto.setId(id);
        return descontosRepository.save(desconto);
    }

    public void deletar(Long id) {
        descontosRepository.deleteById(id);
    }

    public void inativar(Long id) {
        DescontosModel desconto = descontosRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Desconto não encontrado"));
        desconto.setAtivo(false);
        descontosRepository.save(desconto);
    }
}
