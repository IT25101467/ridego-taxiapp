package com.taxi.taxiapp.model;

// INHERITANCE
public class Driver extends User {

    // Attributes specific ONLY to the person behind the wheel
    private String licenseNumber;
    private boolean isAvailable = true;
    private String currentBookingId = null; // To track their active job

    public Driver(String id, String name, String email, String password, String phoneNumber, String licenseNumber, boolean isAvailable) {
        super(id, name, email, password, phoneNumber);
        this.licenseNumber = licenseNumber;
        this.isAvailable = isAvailable; // Admin needs this to know who to dispatch!
    }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    // POLYMORPHISM
    @Override
    public String getDashboardMenu() {
        return "Driver Menu: 1. View Assigned Rides | 2. Toggle Availability Status";
    }
}