package com.example.hrpayroll.Service;

import com.example.hrpayroll.DTO.CompanyPatchDTO;
import com.example.hrpayroll.Model.CompanyModel;
import com.example.hrpayroll.Repository.CompanyRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {
        @Autowired
        private final CompanyRepository companyRepository;

        public CompanyService(CompanyRepository companyRepository) {
                this.companyRepository = companyRepository;
        }

        public CompanyModel create(CompanyModel companyModel) {
                return companyRepository.save(companyModel);
        }

        public List<CompanyModel> list() {
                return companyRepository.findAll();
        }

        public Optional<CompanyModel> findOneById(Long id) {
                return companyRepository.findById(id);
        }

        public CompanyModel update(Long id, CompanyPatchDTO updatedCompany) {
                Optional<CompanyModel> optionalCompany = companyRepository.findById(id);

                if (optionalCompany.isEmpty()) {
                        throw new EntityNotFoundException("Company not found with id " + id);
                }

                CompanyModel company = optionalCompany.get();

                if (updatedCompany.cnpj() != null) {
                        company.setCnpj(updatedCompany.cnpj());
                }
                if (updatedCompany.razaoSocial() != null) {
                        company.setRazaoSocial(updatedCompany.razaoSocial());
                }

                return companyRepository.save(company);
        }
}
