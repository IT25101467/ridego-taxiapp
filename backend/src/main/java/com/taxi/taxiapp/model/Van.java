package com.taxi.taxiapp.model;

public class Van extends Vehicle {
    private static final double RATE_PER_KM = 150.0;
    private static final double BASE_FARE = 300.0;

    public Van(String vehicleId, String model, String licensePlate) {
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