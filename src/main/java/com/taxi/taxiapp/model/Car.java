package com.taxi.taxiapp.model;

// INHERITANCE: Car gets the ID, model, and license plate from the Vehicle blueprint
public class Car extends Vehicle {

    // A standard rate for a car (e.g., LKR per km)
    private static final double RATE_PER_KM = 120.0;
    private static final double BASE_FARE = 200.0; // Cars usually have a starting drop fee

    public Car(String vehicleId, String model, String licensePlate) {
        super(vehicleId, model, licensePlate);
    }

    // POLYMORPHISM: The specific math for a Car fare
    @Override
    public double calculateFare(double distanceInKm) {
        return BASE_FARE + (distanceInKm * RATE_PER_KM);
    }
}