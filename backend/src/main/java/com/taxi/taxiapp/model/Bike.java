package com.taxi.taxiapp.model;

public class Bike extends Vehicle {
    private static final double RATE_PER_KM = 60.0;
    private static final double BASE_FARE = 50.0;

    public Bike(String vehicleId, String model, String licensePlate) {
        super(vehicleId, model, licensePlate);
    }

    @Override
    public double calculateFare(double distanceInKm) {
        return BASE_FARE + (distanceInKm * RATE_PER_KM);
    }

    @Override
    public double getBaseFare() {
        return BASE_FARE;
    }

    @Override
    public double getRatePerKm() {
        return RATE_PER_KM;
    }
}