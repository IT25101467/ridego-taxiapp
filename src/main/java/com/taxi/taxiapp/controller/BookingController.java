package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.model.Car;
import com.taxi.taxiapp.model.RideBooking;
import com.taxi.taxiapp.model.Vehicle;
import com.taxi.taxiapp.repository.RideRepository;
import com.taxi.taxiapp.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // This tells Java to trust your React app
@RestController
@RequestMapping("/api/bookings")




public class BookingController {






    private final RideRepository rideRepository = new RideRepository();
    private final BookingService bookingService = new BookingService();


    /**
     * CREATE: Passenger calls this to request a new ride.
     * URL: POST http://localhost:8080/api/bookings/request
     */
    @PostMapping("/request")
    public String requestRide(@RequestBody RideBooking newBooking) {
        // In a real app, we'd generate a unique ID. For now, let's use a simple timestamp.
        String generatedId = "B" + System.currentTimeMillis() % 10000;
        newBooking.setBookingId(generatedId);
        newBooking.setStatus("PENDING");

        // Call the repository to save this to bookings.txt
        rideRepository.saveBooking(newBooking);

        return "Ride requested successfully! Your Booking ID is: " + generatedId;
    }

    @GetMapping("/all")
    public List<RideBooking> getAllBookings() {
        // We will tell the repository to go read the text file and bring us the list
        return rideRepository.getAllBookings();
    }




    /**
     * READ: Admin calls this to see all pending rides.
     * URL: GET http://localhost:8080/api/bookings/pending
     */
    @GetMapping("/pending")
    public List<RideBooking> getPendingRides() {
        return bookingService.getPendingRides();
    }

    /**
     * UPDATE: Admin calls this to assign a driver to a specific ride.
     * This hits the 'Update' part of your CRUD requirements.
     */
    @PutMapping("/assign/{bookingId}")
    public String assignDriver(@PathVariable String bookingId, @RequestParam String driverId) {
        // 1. For the project demo, we create a temporary 'Car' object
        // In a full app, you'd fetch the driver's actual car from users.txt
        Vehicle assignedVehicle = new Car("V-99", "Toyota Prius", "WP-ABC-1234");

        // 2. Call the service to update the file
        bookingService.assignDriverToRide(bookingId, driverId, assignedVehicle);

        return "Success: Driver " + driverId + " assigned to " + bookingId;
    }



    /**
     * UPDATE: Driver toggles availability.
     * PUT http://localhost:8080/api/bookings/driver/status?available=true
     */
    @PutMapping("/driver/status")
    public String updateStatus(@RequestParam String driverId, @RequestParam boolean available) {
        // bookingService.toggleDriverStatus(driverId, available);
        return "Driver " + driverId + " is now " + (available ? "Available" : "Offline");
    }

    /**
     * UPDATE: Driver finishes the trip.
     * PUT http://localhost:8080/api/bookings/complete/{bookingId}
     */
    @PutMapping("/complete/{bookingId}")
    public String finishTrip(@PathVariable String bookingId, @RequestParam String driverId) {
        bookingService.completeRide(bookingId, driverId);
        return "Trip " + bookingId + " marked as COMPLETED. Driver is now free!";
    }




}