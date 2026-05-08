package com.taxi.taxiapp.model;

public class Tuk extends Vehicle {

    // Tuks are cheaper and usually don't have a massive base drop fee!
    private static final double RATE_PER_KM = 80.0;
    private static final double BASE_FARE = 100.0;

    public Tuk(String vehicleId, String model, String licensePlate) {
        super(vehicleId, model, licensePlate);
    }

    // POLYMORPHISM: The math here is completely different than the Car!
    @Override
    public double calculateFare(double distanceInKm) {
        return BASE_FARE + (distanceInKm * RATE_PER_KM);
    }
}