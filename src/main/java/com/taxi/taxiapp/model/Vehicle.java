package com.taxi.taxiapp.model;

/**
 * ABSTRACTION: This is the generic blueprint for all cars.
 * ENCAPSULATION: All attributes are private.
 */
public abstract class Vehicle {
    private String vehicleId;
    private String model; // e.g., "Toyota Prius"
    private String licensePlate;

    public Vehicle(String vehicleId, String model, String licensePlate) {
        this.vehicleId = vehicleId;
        this.model = model;
        this.licensePlate = licensePlate;
    }

    // Getters and Setters
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    /**
     * POLYMORPHISM: Abstract method!
     * Every specific car type must define its own way to calculate the fare.
     */
    public abstract double calculateFare(double distanceInKm);
}