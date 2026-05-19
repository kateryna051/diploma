package com.example.lithtalk.dto;

public class ChangePasswordRequest {
    private String email;
    private String currentPassword;
    private String newPassword;
    private String confirmNewPassword;

    public String getEmail() {
        return email;
    }

    public String getCurrentPassword(){
        return currentPassword;
    }

    public String getConfirmNewPassword() {
        return confirmNewPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    // getters and setters
}
