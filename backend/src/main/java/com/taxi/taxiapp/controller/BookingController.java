package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.model.Car;
import com.taxi.taxiapp.model.RideBooking;
import com.taxi.taxiapp.model.Vehicle;
import com.taxi.taxiapp.service.BookingService;
import com.taxi.taxiapp.repository.RideRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private BookingService bookingService;

    // ✅ CREATE ride (DB insert)
    @PostMapping("/request")
    public RideBooking requestRide(@RequestBody RideBooking newBooking) {

        newBooking.setStatus("PENDING");

        // 🔥 JPA will auto generate ID
        return rideRepository.save(newBooking);
    }

    // ✅ READ all
    @GetMapping("/all")
    public List<RideBooking> getAllBookings() {
        return rideRepository.findAll();
    }

    // ✅ READ pending
    @GetMapping("/pending")
    public List<RideBooking> getPendingRides() {
        return bookingService.getPendingRides();
    }

    // ✅ ASSIGN driver
    @PutMapping("/assign/{id}")
    public String assignDriver(@PathVariable Long id,
                               @RequestParam String driverId) {

        Vehicle vehicle = new Car("V-99", "Toyota Prius", "WP-ABC-1234");

        bookingService.assignDriverToRide(id, driverId, vehicle);

        return "Driver assigned successfully!";
    }

    // ✅ COMPLETE ride
  @PutMapping("/complete/{bookingId}")
public String finishTrip(@PathVariable Long bookingId, @RequestParam String driverId) {
    bookingService.completeRide(bookingId, driverId); 
    return "Trip completed successfully!";
}
}