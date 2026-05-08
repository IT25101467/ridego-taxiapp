package com.taxi.taxiapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ride_bookings")
public class RideBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // ✅ DB primary key

    private String passengerId;
    private String driverId;
    private String vehicleId;

    private String pickupLocation;
    private String dropoffLocation;

    private double distanceInKm;
    private double calculatedFare;

    private String status;

    // ✅ Default constructor (JPA needs this)
    public RideBooking() {}

    // ✅ Optional constructor
    public RideBooking(String passengerId, String pickupLocation, String dropoffLocation, double distanceInKm) {
        this.passengerId = passengerId;
        this.pickupLocation = pickupLocation;
        this.dropoffLocation = dropoffLocation;
        this.distanceInKm = distanceInKm;
        this.status = "PENDING";
    }

    // --- Getters & Setters ---

    public Long getId() { return id; }

    public String getPassengerId() { return passengerId; }
    public void setPassengerId(String passengerId) { this.passengerId = passengerId; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDropoffLocation() { return dropoffLocation; }
    public void setDropoffLocation(String dropoffLocation) { this.dropoffLocation = dropoffLocation; }

    public double getDistanceInKm() { return distanceInKm; }
    public void setDistanceInKm(double distanceInKm) { this.distanceInKm = distanceInKm; }

    public double getCalculatedFare() { return calculatedFare; }
    public void setCalculatedFare(double calculatedFare) { this.calculatedFare = calculatedFare; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}