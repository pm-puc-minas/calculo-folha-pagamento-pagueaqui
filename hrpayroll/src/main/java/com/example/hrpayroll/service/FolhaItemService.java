package com.example.hrpayroll.service;

import com.example.hrpayroll.model.FolhaItemModel;
import com.example.hrpayroll.repository.IFolhaItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolhaItemService {

    @Autowired
    private IFolhaItemRepository repository;

    public List<FolhaItemModel> findAll() {
        return repository.findAll();
    }

    public FolhaItemModel save(FolhaItemModel folhaItem) {
        return repository.save(folhaItem);
    }

}