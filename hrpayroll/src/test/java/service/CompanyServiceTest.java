package com.example.hrpayroll.service;

import com.example.hrpayroll.dto.CompanyPatchDTO;
import com.example.hrpayroll.model.CompanyModel;
import com.example.hrpayroll.repository.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyService companyService;

    private CompanyModel company;
    private CompanyPatchDTO companyPatchDTO;

    @BeforeEach
    void setUp() {
        company = new CompanyModel();
        company.setId(1L);
        company.setCnpj("12345678000199");
        company.setRazaoSocial("Empresa Exemplo S.A.");

        companyPatchDTO = new CompanyPatchDTO("98765432000100", "Nova Razão Social");
    }

    @Test
    @DisplayName("Deve criar uma nova empresa com sucesso")
    void create_shouldReturnSavedCompany() {
        when(companyRepository.save(any(CompanyModel.class))).thenReturn(company);

        CompanyModel newCompany = new CompanyModel();
        CompanyModel savedCompany = companyService.create(newCompany);

        assertThat(savedCompany).isNotNull();
        assertThat(savedCompany.getId()).isEqualTo(1L);
        verify(companyRepository, times(1)).save(any(CompanyModel.class));
    }

    @Test
    @DisplayName("Deve listar todas as empresas")
    void list_shouldReturnListOfCompanies() {
        when(companyRepository.findAll()).thenReturn(List.of(company));

        List<CompanyModel> companies = companyService.list();

        assertThat(companies).isNotNull();
        assertThat(companies).hasSize(1);
    }

    @Test
    @DisplayName("Deve encontrar uma empresa por ID com sucesso")
    void findById_whenCompanyExists_shouldReturnCompany() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));

        CompanyModel foundCompany = companyService.findById(1L);

        assertThat(foundCompany).isNotNull();
        assertThat(foundCompany.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Deve retornar nulo ao procurar por um ID que não existe")
    void findById_whenCompanyDoesNotExist_shouldReturnNull() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());

        CompanyModel foundCompany = companyService.findById(99L);

        assertThat(foundCompany).isNull();
    }

    @Test
    @DisplayName("Deve atualizar uma empresa com sucesso")
    void update_whenCompanyExists_shouldReturnUpdatedCompany() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(companyRepository.save(any(CompanyModel.class))).thenReturn(company);

        CompanyModel updatedCompany = companyService.update(1L, companyPatchDTO);

        assertThat(updatedCompany).isNotNull();
        assertThat(updatedCompany.getCnpj()).isEqualTo("98765432000100");
        assertThat(updatedCompany.getRazaoSocial()).isEqualTo("Nova Razão Social");
        verify(companyRepository).save(company);
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar atualizar uma empresa que não existe")
    void update_whenCompanyDoesNotExist_shouldThrowException() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            companyService.update(99L, companyPatchDTO);
        });

        assertEquals("Company not found with id 99", exception.getMessage());
        verify(companyRepository, never()).save(any());
    }
}
