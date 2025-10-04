package com.example.hrpayroll.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.example.hrpayroll.dto.CompanyPatchDTO;
import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.service.CompanyService;

@RestController
public class CompanyController {
    @Autowired
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/companies/create")
    public CompanyModel createCompany(@Valid @RequestBody CompanyModel companyModel) {
        return companyService.create(companyModel);
    }

    @GetMapping("/companies/{id}")
    public Optional<CompanyModel> getCompany(@Valid @PathVariable Long id) {
        return companyService.findById(id);
    }

    @GetMapping("/companies")
    public Iterable<CompanyModel> listCompanies() {
        return companyService.list();
    }

    @PatchMapping("/companies/{id}")
    public CompanyModel patchCompany(@PathVariable Long id, @Valid @RequestBody CompanyPatchDTO companyPatchDto) {
        return companyService.update(id, companyPatchDto);
    }
}
