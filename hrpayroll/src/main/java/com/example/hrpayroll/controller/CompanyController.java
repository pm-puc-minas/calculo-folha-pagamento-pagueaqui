package com.example.hrpayroll.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
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
public class CompanyController {
    @Autowired
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/create")
    public ResponseEntity<CompanyModel> createCompany(@Valid @RequestBody CompanyModel companyModel) {
        CompanyModel created = companyService.create(companyModel);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");

        return ResponseEntity.ok()
                .headers(headers)
                .body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyModel> getCompany(@Valid @PathVariable Long id) {

        CompanyModel company = companyService.findById(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        return ResponseEntity.ok()
                .headers(headers)
                .body(company);
    }

    @GetMapping("/list")
    public ResponseEntity<List<CompanyModel>> listCompanies() {

        List<CompanyModel> companies =  companyService.list();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
    return ResponseEntity.ok()
        .headers(headers)
        .body(companies);

    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<Void> patchCompany(@PathVariable Long id, @Valid @RequestBody CompanyPatchDTO companyPatchDto) {
        companyService.update(id, companyPatchDto);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        return ResponseEntity.ok()
                .headers(headers)
                .build();
    }
}
