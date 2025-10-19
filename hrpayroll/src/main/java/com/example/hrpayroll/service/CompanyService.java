package com.example.hrpayroll.service;

import com.example.hrpayroll.dto.CompanyPatchDTO;
import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.repository.ICompanyRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {
        @Autowired
        private final ICompanyRepository ICompanyRepository;

        public CompanyService(ICompanyRepository ICompanyRepository) {
                this.ICompanyRepository = ICompanyRepository;
        }

        public CompanyModel create(CompanyModel companyModel) {
                return ICompanyRepository.save(companyModel);
        }

        public List<CompanyModel> list() {
                return ICompanyRepository.findAll();
        }

        public CompanyModel findById(Long id) {
                Optional<CompanyModel> companyOptional = ICompanyRepository.findById(id);

                if (companyOptional.isPresent()) {

                    CompanyModel companyModel = companyOptional.get();
                    return companyModel;

                }

                return null;
        }

        public CompanyModel update(Long id, CompanyPatchDTO updatedCompany) {
                Optional<CompanyModel> optionalCompany = ICompanyRepository.findById(id);

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

                return ICompanyRepository.save(company);
        }

}
