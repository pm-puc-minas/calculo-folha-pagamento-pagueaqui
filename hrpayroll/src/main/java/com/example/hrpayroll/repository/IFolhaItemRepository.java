package com.example.hrpayroll.repository;

import com.example.hrpayroll.model.FolhaItemModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IFolhaItemRepository extends JpaRepository<FolhaItemModel, Long> {
}