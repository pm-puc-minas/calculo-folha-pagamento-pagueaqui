package com.example.hrpayroll.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrpayroll.Model.CompanyModel;

public interface CompanyRepository extends JpaRepository<CompanyModel, Long>{}
