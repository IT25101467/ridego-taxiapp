package com.taxi.taxiapp.repository;

import com.taxi.taxiapp.model.RideBooking;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class RideRepository {
    private final String FILE_PATH = "bookings.txt";

    public void saveBooking(RideBooking booking) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
            writer.write(serializeBooking(booking));
            writer.newLine();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<RideBooking> getAllBookings() {
        List<RideBooking> bookings = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // Skip empty lines to prevent crashes
                if (!line.trim().isEmpty()) {
                    bookings.add(deserializeBooking(line));
                }
            }
        } catch (IOException e) {
            // File might not exist yet on first run
        }
        return bookings;
    }

    public void updateBooking(RideBooking updatedBooking) {
        List<RideBooking> allBookings = getAllBookings();
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, false))) {
            for (RideBooking b : allBookings) {
                if (b.getBookingId().equals(updatedBooking.getBookingId())) {
                    writer.write(serializeBooking(updatedBooking));
                } else {
                    writer.write(serializeBooking(b));
                }
                writer.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // --- THE FIX: Using | instead of , and adding distance/fare ---

    // Helper to turn Object -> String for the file
    private String serializeBooking(RideBooking b) {
        return b.getBookingId() + "|" +
                b.getPassengerId() + "|" +
                b.getDriverId() + "|" +
                b.getPickupLocation() + "|" +
                b.getDropoffLocation() + "|" +
                b.getDistanceInKm() + "|" +       // ADDED DISTANCE
                b.getCalculatedFare() + "|" +     // ADDED FARE
                b.getStatus();
    }

    // Helper to turn String -> Object for the app
    private RideBooking deserializeBooking(String line) {
        // We use \\| because | is a special regex character in Java!
        String[] parts = line.split("\\|");

        // Parse the numbers safely
        double distance = Double.parseDouble(parts[5]);
        double fare = Double.parseDouble(parts[6]);

        RideBooking b = new RideBooking(parts[0], parts[1], parts[3], parts[4], distance);

        // Handle the "null" text issue
        if (parts[2].equals("null")) {
            b.setDriverId(null);
        } else {
            b.setDriverId(parts[2]);
        }

        b.setCalculatedFare(fare);
        b.setStatus(parts[7]);

        return b;
    }

    public RideBooking getBookingById(String bookingId) {
        List<RideBooking> allBookings = getAllBookings();
        for (RideBooking b : allBookings) {
            if (b.getBookingId().equals(bookingId)) {
                return b;
            }
        }
        return null;
    }
}