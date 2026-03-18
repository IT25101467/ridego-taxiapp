package com.taxi.taxiapp.model;

/**
 * ENCAPSULATION: We secure the booking data in this class.
 * This acts as the "Transaction" record for every ride requested.
 */
public class RideBooking {

    private String bookingId;
    private String passengerId; // Who requested the ride
    private String driverId;    // Who the Admin assigns to the ride (starts as null)
    private String vehicleId;   // What car they are driving
    private String pickupLocation;
    private String dropoffLocation;
    private double distanceInKm;
    private double calculatedFare;

    // Status can be: "PENDING", "ASSIGNED", "COMPLETED", "CANCELED"
    private String status;

    public RideBooking() {}

    // Constructor for when a Passenger first requests a ride
    // Notice driverId, vehicleId, and fare are NOT here yet, because the admin hasn't assigned them!
    public RideBooking(String bookingId, String passengerId, String pickupLocation, String dropoffLocation, double distanceInKm) {
        this.bookingId = bookingId;
        this.passengerId = passengerId;
        this.pickupLocation = pickupLocation;
        this.dropoffLocation = dropoffLocation;
        this.distanceInKm = distanceInKm;
        this.status = "PENDING"; // All new rides start as pending
    }

    // --- Getters and Setters (Encapsulation) ---

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

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