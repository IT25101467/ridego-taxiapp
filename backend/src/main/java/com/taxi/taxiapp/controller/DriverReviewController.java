package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.model.DriverReview;
import com.taxi.taxiapp.model.RideBooking;
import com.taxi.taxiapp.model.User;
import com.taxi.taxiapp.repository.DriverReviewRepository;
import com.taxi.taxiapp.repository.RideRepository;
import com.taxi.taxiapp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/driver-reviews")
public class DriverReviewController {

    private final DriverReviewRepository driverReviewRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public DriverReviewController(DriverReviewRepository driverReviewRepository) {
        this.driverReviewRepository = driverReviewRepository;
        this.rideRepository = new RideRepository();
        this.userRepository = new UserRepository();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addDriverReview(@RequestBody Map<String, Object> payload) {
        String bookingId = stringValue(payload.get("bookingId"));
        String customerId = stringValue(payload.get("customerId"));
        int rating = parseRating(payload.get("rating"));

        if (bookingId.isBlank() || customerId.isBlank()) {
            return error(HttpStatus.BAD_REQUEST, "bookingId and customerId are required.");
        }
        if (rating < 1 || rating > 5) {
            return error(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5.");
        }
        if (driverReviewRepository.existsForBooking(bookingId)) {
            return error(HttpStatus.CONFLICT, "This trip has already been rated.");
        }

        RideBooking booking = rideRepository.getAllBookings().stream()
                .filter(b -> b.getBookingId().equals(bookingId))
                .findFirst()
                .orElse(null);

        if (booking == null) {
            return error(HttpStatus.NOT_FOUND, "Booking not found.");
        }
        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            return error(HttpStatus.BAD_REQUEST, "Only completed trips can be rated.");
        }
        if (!customerId.equals(booking.getPassengerId())) {
            return error(HttpStatus.FORBIDDEN, "You can only rate your own trips.");
        }

        String driverId = booking.getDriverId();
        if (driverId == null || driverId.isBlank() || "null".equalsIgnoreCase(driverId)) {
            return error(HttpStatus.BAD_REQUEST, "This trip has no assigned driver to rate.");
        }

        String customerName = resolveUserName(customerId);
        String driverName = resolveUserName(driverId);
        String date = LocalDate.now().toString();
        String reviewId = "dr" + System.currentTimeMillis();

        DriverReview review = new DriverReview(
                reviewId,
                bookingId,
                customerId,
                customerName,
                driverId,
                driverName,
                booking.getPickupLocation(),
                booking.getDropoffLocation(),
                rating,
                date
        );

        driverReviewRepository.save(review);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("review", toMap(review));
        return ResponseEntity.ok(body);
    }

    @GetMapping("/all")
    public List<Map<String, Object>> getAllDriverReviews() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (DriverReview review : driverReviewRepository.findAll()) {
            result.add(toMap(review));
        }
        return result;
    }

    @GetMapping("/summary")
    public List<Map<String, Object>> getDriverSummary() {
        Map<String, List<Integer>> ratingsByDriver = new LinkedHashMap<>();
        Map<String, String> namesByDriver = new LinkedHashMap<>();

        for (DriverReview review : driverReviewRepository.findAll()) {
            ratingsByDriver
                    .computeIfAbsent(review.getDriverId(), k -> new ArrayList<>())
                    .add(review.getRating());
            namesByDriver.putIfAbsent(review.getDriverId(), review.getDriverName());
        }

        List<Map<String, Object>> summary = new ArrayList<>();
        for (Map.Entry<String, List<Integer>> entry : ratingsByDriver.entrySet()) {
            String driverId = entry.getKey();
            List<Integer> ratings = entry.getValue();
            double avg = ratings.stream().mapToInt(Integer::intValue).average().orElse(0);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("driverId", driverId);
            row.put("driverName", namesByDriver.getOrDefault(driverId, driverId));
            row.put("avgRating", Math.round(avg * 10.0) / 10.0);
            row.put("reviewCount", ratings.size());
            summary.add(row);
        }

        summary.sort((a, b) -> Double.compare(
                (Double) b.get("avgRating"),
                (Double) a.get("avgRating")
        ));
        return summary;
    }

    private String resolveUserName(String userId) {
        return userRepository.loadAll().stream()
                .filter(u -> u.getId().equals(userId))
                .map(User::getName)
                .findFirst()
                .orElse(userId);
    }

    private Map<String, Object> toMap(DriverReview review) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", review.getId());
        map.put("bookingId", review.getBookingId());
        map.put("customerId", review.getCustomerId());
        map.put("customerName", review.getCustomerName());
        map.put("driverId", review.getDriverId());
        map.put("driverName", review.getDriverName());
        map.put("pickup", review.getPickup());
        map.put("dropoff", review.getDropoff());
        map.put("rating", review.getRating());
        map.put("date", review.getDate());
        return map;
    }

    private String stringValue(Object value) {
        return value == null ? "" : value.toString().trim();
    }

    private int parseRating(Object value) {
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(stringValue(value));
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("error", message);
        return ResponseEntity.status(status).body(body);
    }
}
