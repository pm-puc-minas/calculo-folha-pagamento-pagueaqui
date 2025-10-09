package com.example.hrpayroll.dto.response;

public class EmployeeAuthControllerRegister200 {
    private String message;
    private boolean success;
    
    public EmployeeAuthControllerRegister200() {}
    
    public EmployeeAuthControllerRegister200(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
}