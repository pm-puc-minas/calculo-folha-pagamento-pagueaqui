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

}
