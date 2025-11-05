package com.example.hrpayroll.service;

import com.example.hrpayroll.model.CargoModel;
import com.example.hrpayroll.model.DepartamentoModel;
import com.example.hrpayroll.repository.ICargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CargoService {

    @Autowired
    ICargoRepository cargoRepository;

    public CargoService(ICargoRepository cargoRepository) {
        this.cargoRepository = cargoRepository;
    }

    public CargoModel create(CargoModel cargoModel) {
        return cargoRepository.save(cargoModel);
    }

}
