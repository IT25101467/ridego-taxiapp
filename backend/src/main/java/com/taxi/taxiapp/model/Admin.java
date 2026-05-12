package com.taxi.taxiapp.model;

// INHERITANCE
public class Admin extends User  {

    // ENCAPSULATION
    private String adminRole; // e.g., "Dispatcher" or "SuperAdmin"

    public Admin(String id, String name, String email, String password, String phoneNumber, String adminRole) {
        super(id, name, email, password, phoneNumber);
        this.adminRole = adminRole;
    }

    public String getAdminRole() { return adminRole; }
    public void setAdminRole(String adminRole) { this.adminRole = adminRole; }

    // POLYMORPHISM
   
}