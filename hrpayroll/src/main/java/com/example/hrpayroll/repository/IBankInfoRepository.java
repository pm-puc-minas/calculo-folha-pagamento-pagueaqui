package com.example.hrpayroll.repository;

import com.example.hrpayroll.model.BankInfoModel;
import com.example.hrpayroll.model.CargoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IBankInfoRepository extends JpaRepository<BankInfoModel, Long> {}