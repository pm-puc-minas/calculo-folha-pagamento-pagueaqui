package com.example.hrpayroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrpayroll.model.UserModel;

public interface UserRepository extends JpaRepository<UserModel, Long>{}
