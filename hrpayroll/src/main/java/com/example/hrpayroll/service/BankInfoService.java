package com.example.hrpayroll.service;

import com.example.hrpayroll.dto.BankInfoCreateDTO;
import com.example.hrpayroll.model.BankInfoModel;
import com.example.hrpayroll.model.CargoModel;
import com.example.hrpayroll.repository.IBankInfoRepository;
import com.example.hrpayroll.repository.ICompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BankInfoService {

    @Autowired
    private final IBankInfoRepository iBankInfoRepository;


    public BankInfoService(IBankInfoRepository iBankInfoRepository) {
        this.iBankInfoRepository = iBankInfoRepository;
    }

    public BankInfoModel create(BankInfoCreateDTO bankInfoModel) {

        BankInfoModel entity = new BankInfoModel();
        entity.setAgencia(bankInfoModel.getAgencia());
        entity.setBanco(bankInfoModel.getBanco());
        entity.setConta(bankInfoModel.getConta());
        entity.setCodigoBanco(bankInfoModel.getCodigoBanco());
        entity.setDigitoVerificador(bankInfoModel.getDigitoVerificador());

        return iBankInfoRepository.save(entity);
    }
}
