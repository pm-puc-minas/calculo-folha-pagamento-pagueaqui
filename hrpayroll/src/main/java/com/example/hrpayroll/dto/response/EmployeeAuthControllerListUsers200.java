package com.example.hrpayroll.dto.response;

import java.util.List;

public class EmployeeAuthControllerListUsers200 {
    private List<UserSummaryDto> users;
    private int totalUsers;
    
    public EmployeeAuthControllerListUsers200() {}
    
    public EmployeeAuthControllerListUsers200(List<UserSummaryDto> users, int totalUsers) {
        this.users = users;
        this.totalUsers = totalUsers;
    }
    
    public List<UserSummaryDto> getUsers() {
        return users;
    }
    
    public void setUsers(List<UserSummaryDto> users) {
        this.users = users;
    }
    
    public int getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }
    
    public static class UserSummaryDto {
        private Long id;
        private String nome;
        private String sobrenome;
        private String email;
        private String cargo;
        
        public UserSummaryDto() {}
        
        public UserSummaryDto(Long id, String nome, String sobrenome, String email, String cargo) {
            this.id = id;
            this.nome = nome;
            this.sobrenome = sobrenome;
            this.email = email;
            this.cargo = cargo;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getNome() {
            return nome;
        }
        
        public void setNome(String nome) {
            this.nome = nome;
        }
        
        public String getSobrenome() {
            return sobrenome;
        }
        
        public void setSobrenome(String sobrenome) {
            this.sobrenome = sobrenome;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getCargo() {
            return cargo;
        }
        
        public void setCargo(String cargo) {
            this.cargo = cargo;
        }
    }
}