package com.example.hrpayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrpayroll.model.CompanyModel;

public interface ICompanyRepository extends JpaRepository<CompanyModel, Long>{}
