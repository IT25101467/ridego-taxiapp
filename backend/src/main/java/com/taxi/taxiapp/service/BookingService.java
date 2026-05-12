package com.taxi.taxiapp.service;

import com.taxi.taxiapp.model.RideBooking;
import com.taxi.taxiapp.model.Vehicle;
import com.taxi.taxiapp.repository.RideRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private RideRepository rideRepository;

    // CREATE
    public RideBooking saveBooking(RideBooking booking) {
        return rideRepository.save(booking);
    }

    // READ all
    public List<RideBooking> getAllBookings() {
        return rideRepository.findAll();
    }

    // READ by id
    public RideBooking getBookingById(Long id) {
        return rideRepository.findById(id).orElse(null);
    }

    // READ pending rides
    public List<RideBooking> getPendingRides() {
        return rideRepository.findByStatus("PENDING");
    }

    // ASSIGN driver
    public void assignDriverToRide(Long bookingId, String driverId, Vehicle vehicle) {

        RideBooking booking = rideRepository.findById(bookingId).orElse(null);

        if (booking != null) {

            double fare = vehicle.calculateFare(booking.getDistanceInKm());

            booking.setDriverId(driverId);
            booking.setVehicleId(vehicle.getVehicleId());
            booking.setCalculatedFare(fare);
            booking.setStatus("ASSIGNED");

            rideRepository.save(booking);
        }
    }

    // COMPLETE ride
    public void completeRide(Long bookingId, String driverId) {

        RideBooking booking = rideRepository.findById(bookingId).orElse(null);

        if (booking != null) {

            booking.setStatus("COMPLETED");

            rideRepository.save(booking);
        }
    }
}