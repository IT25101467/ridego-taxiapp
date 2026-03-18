package com.taxi.taxiapp.model;



/**
 * INHERITANCE
 */
public class Passenger extends User {

    public Passenger(String id, String name, String email, String password, String phoneNumber) {
        super(id, name, email, password, phoneNumber);
    }

    // POLYMORPHISM
    @Override
    public String getDashboardMenu() {
        return "Passenger Menu: 1. Request a Ride | 2. View Ride Status";
    }
}