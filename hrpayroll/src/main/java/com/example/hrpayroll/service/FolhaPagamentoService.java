package com.example.hrpayroll.service;

import com.example.hrpayroll.repository.FolhaPagamentoRepository;
import org.springframework.stereotype.Service;

@Service
public class FolhaPagamentoService {
    private final FolhaPagamentoRepository repository

    public FolhaPagamentoService (FolhaPagamentoRepository repository) {
        this.repository = repository;

            }
}
