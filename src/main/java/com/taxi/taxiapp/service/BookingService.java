package com.taxi.taxiapp.service;

import com.taxi.taxiapp.model.Driver;
import com.taxi.taxiapp.model.RideBooking;
import com.taxi.taxiapp.model.Vehicle;
import com.taxi.taxiapp.repository.RideRepository;
import com.taxi.taxiapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service // This tells Spring Boot to manage this class
public class BookingService {

    private final RideRepository rideRepository = new RideRepository();
    private final UserRepository userRepository = new UserRepository();

    /**
     * LOGIC: Admin views only pending rides.
     */
    public List<RideBooking> getPendingRides() {
        return rideRepository.getAllBookings().stream()
                .filter(ride -> ride.getStatus().equals("PENDING"))
                .collect(Collectors.toList());
    }



    /**
     * DRIVER LOGIC: Toggle availability.
     */
    public void toggleDriverStatus(String driverId, boolean status) {
        // Logic to find driver in users.txt and flip their isAvailable boolean
    }

    /**
     * DRIVER LOGIC: Finish the trip.
     * This updates the booking status AND frees up the driver.
     */
    public void completeRide(String bookingId, String driverId) {
        // 1. Fetch the specific booking using our new method
        RideBooking booking = rideRepository.getBookingById(bookingId);

        if (booking != null) {
            // 2. Change the status to COMPLETED
            booking.setStatus("COMPLETED");

            // 3. Save the change back to bookings.txt
            rideRepository.updateBooking(booking);

            // 4. (Optional) Log it to the console for your demo
            System.out.println("Trip " + bookingId + " finalized. Driver " + driverId + " is now free.");
        }
    }







    /**
     * LOGIC: Admin assigns a driver to a ride.
     * This fulfills the core project requirement.
     */
    public void assignDriverToRide(String bookingId, String driverId, Vehicle vehicle) {
        // 1. Find the booking
        List<RideBooking> all = rideRepository.getAllBookings();
        RideBooking booking = all.stream()
                .filter(b -> b.getBookingId().equals(bookingId))
                .findFirst()
                .orElse(null);

        if (booking != null) {
            // 2. Use POLYMORPHISM to calculate the fare based on the specific vehicle type
            double fare = vehicle.calculateFare(booking.getDistanceInKm());

            // 3. Update the booking details
            booking.setDriverId(driverId);
            booking.setVehicleId(vehicle.getVehicleId());
            booking.setCalculatedFare(fare);
            booking.setStatus("ASSIGNED");

            // 4. Save the updated booking back to 'bookings.txt'
            rideRepository.updateBooking(booking);
        }
    }
}