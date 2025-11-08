package com.example.hrpayroll.service;

import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.model.DepartamentoModel;
import com.example.hrpayroll.repository.IDepartamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartamentoService {

    @Autowired
    private final IDepartamentoRepository departamentoRepository;

    public DepartamentoService(IDepartamentoRepository departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    public DepartamentoModel create(DepartamentoModel departamentoModel) {
        return departamentoRepository.save(departamentoModel);
    }

    public List<DepartamentoModel> listar() {
        return departamentoRepository.findAll();
    }

    public DepartamentoModel findById(Long id) {
        return departamentoRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        departamentoRepository.deleteById(id);
    }
}
