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

    // 🔹 Save booking (CREATE)
    public RideBooking saveBooking(RideBooking booking) {
        return rideRepository.save(booking); // 🔥 auto DB insert
    }

    // 🔹 Get all bookings (READ)
    public List<RideBooking> getAllBookings() {
        return rideRepository.findAll();
    }

    // 🔹 Get booking by ID
    public RideBooking getBookingById(Long id) {
        return rideRepository.findById(id).orElse(null);
    }

    // 🔹 Assign driver (UPDATE)
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
    // 🔹 Complete ride (UPDATE)
    public void completeRide(Long bookingId, String driverId) {

     RideBooking booking = rideRepository.findById(bookingId).orElse(null);

     if (booking != null) {
        booking.setStatus("COMPLETED");
        booking.setDriverId(driverId);

        rideRepository.save(booking);
    }
}
}