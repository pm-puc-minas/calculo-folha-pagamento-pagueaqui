package com.example.hrpayroll.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hrpayroll.Model.UserModel;

public interface UserRepository extends JpaRepository<UserModel, String>{}
