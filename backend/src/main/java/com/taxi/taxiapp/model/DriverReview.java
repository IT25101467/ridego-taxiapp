package com.taxi.taxiapp.model;

/**
 * A customer's star rating for a driver on a specific completed booking.
 */
public class DriverReview {

    private String id;
    private String bookingId;
    private String customerId;
    private String customerName;
    private String driverId;
    private String driverName;
    private String pickup;
    private String dropoff;
    private int rating;
    private String date;

    public DriverReview() {}

    public DriverReview(String id, String bookingId, String customerId, String customerName,
                        String driverId, String driverName, String pickup, String dropoff,
                        int rating, String date) {
        this.id = id;
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.driverId = driverId;
        this.driverName = driverName;
        this.pickup = pickup;
        this.dropoff = dropoff;
        this.rating = rating;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getPickup() { return pickup; }
    public void setPickup(String pickup) { this.pickup = pickup; }

    public String getDropoff() { return dropoff; }
    public void setDropoff(String dropoff) { this.dropoff = dropoff; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
