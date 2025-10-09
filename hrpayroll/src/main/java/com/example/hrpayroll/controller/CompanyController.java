package com.example.hrpayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hrpayroll.dto.CompanyPatchDTO;
import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.service.CompanyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = "*")
public class CompanyController {
    @Autowired
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/create")
    public ResponseEntity<CompanyModel> createCompany(@Valid @RequestBody CompanyModel companyModel) {
        CompanyModel created = companyService.create(companyModel);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyModel> getCompany(@Valid @PathVariable Long id) {

        CompanyModel company = companyService.findById(id);

        return ResponseEntity.ok(company);
    }

    @GetMapping("/list")
    public ResponseEntity<List<CompanyModel>> listCompanies() {

        List<CompanyModel> companies =  companyService.list();

        return ResponseEntity.ok(companies);

    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<Void> patchCompany(@PathVariable Long id, @Valid @RequestBody CompanyPatchDTO companyPatchDto) {
        companyService.update(id, companyPatchDto);
        return ResponseEntity.ok().build();
    }
}
