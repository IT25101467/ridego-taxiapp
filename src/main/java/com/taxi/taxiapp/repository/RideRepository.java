package com.taxi.taxiapp.repository;

import com.taxi.taxiapp.model.RideBooking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class RideRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void saveBooking(RideBooking booking) {
        try {
            String sql = "INSERT INTO bookings (bookingId, passengerId, driverId, pickupLocation, dropoffLocation, distanceInKm, calculatedFare, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, 
                booking.getBookingId(), 
                booking.getPassengerId(), 
                booking.getDriverId(), 
                booking.getPickupLocation(), 
                booking.getDropoffLocation(), 
                booking.getDistanceInKm(), 
                booking.getCalculatedFare(), 
                booking.getStatus());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<RideBooking> getAllBookings() {
        List<RideBooking> bookings = new ArrayList<>();
        try {
            String sql = "SELECT * FROM bookings";
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            
            for (Map<String, Object> row : rows) {
                RideBooking b = new RideBooking(
                    (String) row.get("bookingId"),
                    (String) row.get("passengerId"),
                    (String) row.get("pickupLocation"),
                    (String) row.get("dropoffLocation"),
                    row.get("distanceInKm") != null ? ((Number) row.get("distanceInKm")).doubleValue() : 0.0
                );
                
                b.setDriverId((String) row.get("driverId"));
                b.setCalculatedFare(row.get("calculatedFare") != null ? ((Number) row.get("calculatedFare")).doubleValue() : 0.0);
                b.setStatus((String) row.get("status"));
                
                bookings.add(b);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bookings;
    }

    public void updateBooking(RideBooking updatedBooking) {
        try {
            String sql = "UPDATE bookings SET passengerId = ?, driverId = ?, pickupLocation = ?, dropoffLocation = ?, distanceInKm = ?, calculatedFare = ?, status = ? WHERE bookingId = ?";
            jdbcTemplate.update(sql, 
                updatedBooking.getPassengerId(), 
                updatedBooking.getDriverId(), 
                updatedBooking.getPickupLocation(), 
                updatedBooking.getDropoffLocation(), 
                updatedBooking.getDistanceInKm(), 
                updatedBooking.getCalculatedFare(), 
                updatedBooking.getStatus(),
                updatedBooking.getBookingId());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public RideBooking getBookingById(String bookingId) {
        try {
            String sql = "SELECT * FROM bookings WHERE bookingId = ?";
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, bookingId);
            
            if (!rows.isEmpty()) {
                Map<String, Object> row = rows.get(0);
                RideBooking b = new RideBooking(
                    (String) row.get("bookingId"),
                    (String) row.get("passengerId"),
                    (String) row.get("pickupLocation"),
                    (String) row.get("dropoffLocation"),
                    row.get("distanceInKm") != null ? ((Number) row.get("distanceInKm")).doubleValue() : 0.0
                );
                
                b.setDriverId((String) row.get("driverId"));
                b.setCalculatedFare(row.get("calculatedFare") != null ? ((Number) row.get("calculatedFare")).doubleValue() : 0.0);
                b.setStatus((String) row.get("status"));
                return b;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}