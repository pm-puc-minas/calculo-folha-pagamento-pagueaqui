package com.example.hrpayroll.service;

import com.example.hrpayroll.model.CargoModel;
import com.example.hrpayroll.model.DepartamentoModel;
import com.example.hrpayroll.repository.ICargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public List<CargoModel> listar() {
        return cargoRepository.findAll();
    }

    public CargoModel findById(Long id) {
        Optional<CargoModel> cargo =  cargoRepository.findById(id);

        if (cargo.isPresent()) {
            return cargo.get();
        }

        return null;
    }

    public void deleteById(Long id) {
        cargoRepository.deleteById(id);
    }

    public CargoModel atualizarStatus(Long id, boolean ativo) {
        CargoModel cargo = findById(id);

        cargo.setAtivo(ativo);

        cargo = cargoRepository.save(cargo);

        return cargo;
    }
}
