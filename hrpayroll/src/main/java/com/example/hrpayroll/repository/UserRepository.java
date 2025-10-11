package com.example.hrpayroll.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hrpayroll.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByVerificationCode(String verificationCode);
    
    Optional<User> findByResetPasswordToken(String resetPasswordToken);
    
    boolean existsByEmail(String email);
    
    void deleteByVerificationCodeExpiresAtBefore(LocalDateTime dateTime);
    
    void deleteByResetPasswordExpiresAtBefore(LocalDateTime dateTime);
}