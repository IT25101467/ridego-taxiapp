package com.taxi.taxiapp.repository;

import com.taxi.taxiapp.model.DriverReview;
import com.taxi.taxiapp.model.RideBooking;
import com.taxi.taxiapp.model.User;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class DriverReviewRepository {

    private static final String FILE_PATH = "driver_reviews.txt";
    private static final String LEGACY_REVIEWS_PATH = "reviews.txt";

    private final RideRepository rideRepository = new RideRepository();
    private final UserRepository userRepository = new UserRepository();

    public DriverReviewRepository() {
        ensureFileExists(FILE_PATH);
        migrateLegacyRatings();
    }

    public void save(DriverReview review) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(FILE_PATH, true), StandardCharsets.UTF_8))) {
            writer.write(serialize(review));
            writer.newLine();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save driver review", e);
        }
    }

    public List<DriverReview> findAll() {
        List<DriverReview> reviews = new ArrayList<>();
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            return reviews;
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new FileInputStream(file), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                DriverReview review = deserialize(line);
                if (review != null) {
                    reviews.add(review);
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading driver reviews: " + e.getMessage());
        }
        return reviews;
    }

    public Optional<DriverReview> findByBookingId(String bookingId) {
        return findAll().stream()
                .filter(r -> r.getBookingId().equals(bookingId))
                .findFirst();
    }

    public boolean existsForBooking(String bookingId) {
        return findByBookingId(bookingId).isPresent();
    }

    private String serialize(DriverReview r) {
        return String.join("|",
                sanitize(r.getId()),
                sanitize(r.getBookingId()),
                sanitize(r.getCustomerId()),
                sanitize(r.getCustomerName()),
                sanitize(r.getDriverId()),
                sanitize(r.getDriverName()),
                sanitize(r.getPickup()),
                sanitize(r.getDropoff()),
                String.valueOf(r.getRating()),
                sanitize(r.getDate())
        );
    }

    private DriverReview deserialize(String line) {
        String[] parts = line.split("\\|", -1);
        if (parts.length < 10) {
            return null;
        }
        try {
            DriverReview review = new DriverReview();
            review.setId(parts[0]);
            review.setBookingId(parts[1]);
            review.setCustomerId(parts[2]);
            review.setCustomerName(parts[3]);
            review.setDriverId(parts[4]);
            review.setDriverName(parts[5]);
            review.setPickup(parts[6]);
            review.setDropoff(parts[7]);
            review.setRating(Integer.parseInt(parts[8].trim()));
            review.setDate(parts[9]);
            return review;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String sanitize(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("|", " ").replace("\n", " ").replace("\r", " ").trim();
    }

    private void ensureFileExists(String path) {
        File file = new File(path);
        if (!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                System.err.println("Could not create " + path + ": " + e.getMessage());
            }
        }
    }

    /**
     * Moves legacy {@code bookingId|rating} lines from reviews.txt into driver_reviews.txt.
     */
    private void migrateLegacyRatings() {
        File legacyFile = new File(LEGACY_REVIEWS_PATH);
        if (!legacyFile.exists()) {
            return;
        }

        List<String> keepLines = new ArrayList<>();
        boolean migratedAny = false;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new FileInputStream(legacyFile), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                String[] parts = line.split("\\|", -1);
                if (parts.length == 2) {
                    String bookingId = parts[0].trim();
                    try {
                        int rating = Integer.parseInt(parts[1].trim());
                        if (rating >= 1 && rating <= 5 && migrateSingleLegacy(bookingId, rating)) {
                            migratedAny = true;
                        }
                    } catch (NumberFormatException ignored) {
                        // drop invalid legacy line
                    }
                } else if (parts.length >= 5) {
                    keepLines.add(line);
                }
            }
        } catch (IOException e) {
            System.err.println("Legacy review migration read failed: " + e.getMessage());
            return;
        }

        if (!migratedAny && keepLines.isEmpty()) {
            return;
        }

        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(legacyFile, false), StandardCharsets.UTF_8))) {
            for (String keep : keepLines) {
                writer.write(keep);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Legacy review migration write failed: " + e.getMessage());
        }
    }

    private boolean migrateSingleLegacy(String bookingId, int rating) {
        if (existsForBooking(bookingId)) {
            return false;
        }

        RideBooking booking = findBooking(bookingId);
        if (booking == null) {
            return false;
        }

        String driverId = booking.getDriverId();
        if (driverId == null || driverId.isBlank() || "null".equalsIgnoreCase(driverId)) {
            return false;
        }

        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            return false;
        }

        String customerName = resolveUserName(booking.getPassengerId());
        String driverName = resolveUserName(driverId);
        String date = LocalDate.now().toString();

        DriverReview review = new DriverReview(
                "dr-mig-" + bookingId,
                bookingId,
                booking.getPassengerId(),
                customerName,
                driverId,
                driverName,
                booking.getPickupLocation(),
                booking.getDropoffLocation(),
                rating,
                date
        );
        save(review);
        return true;
    }

    private RideBooking findBooking(String bookingId) {
        return rideRepository.getAllBookings().stream()
                .filter(b -> b.getBookingId().equals(bookingId))
                .findFirst()
                .orElse(null);
    }

    private String resolveUserName(String userId) {
        if (userId == null || userId.isBlank()) {
            return "Unknown";
        }
        return userRepository.loadAll().stream()
                .filter(u -> u.getId().equals(userId))
                .map(User::getName)
                .findFirst()
                .orElse(userId);
    }
}
