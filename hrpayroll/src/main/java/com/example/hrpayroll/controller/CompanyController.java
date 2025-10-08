package com.example.hrpayroll.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.example.hrpayroll.dto.CompanyPatchDTO;
import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.service.CompanyService;

@RestController
@RequestMapping("/companies")
public class CompanyController {
    @Autowired
    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/create")
    public ResponseEntity createCompany(@Valid @RequestBody CompanyModel companyModel) {
        companyService.create(companyModel);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity getCompany(@Valid @PathVariable Long id) {

        CompanyModel company = companyService.findById(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        return ResponseEntity.ok()
                .headers(headers)
                .body(company);
    }

    @GetMapping("/list")
    public ResponseEntity listCompanies() {

        List<CompanyModel> companies =  companyService.list();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        return ResponseEntity.ok()
                .headers(headers)
                .body(companies);

    }

    @PatchMapping("/update/{id}")
    public ResponseEntity patchCompany(@PathVariable Long id, @Valid @RequestBody CompanyPatchDTO companyPatchDto) {
        companyService.update(id, companyPatchDto);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json");
        return ResponseEntity.ok()
                .headers(headers)
                .build();
    }
}
