CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phonenum VARCHAR(20),
    available BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS bookings (
    bookingId VARCHAR(50) PRIMARY KEY,
    passengerId VARCHAR(50) NOT NULL,
    driverId VARCHAR(50),
    pickupLocation VARCHAR(150) NOT NULL,
    dropoffLocation VARCHAR(150) NOT NULL,
    distanceInKm DOUBLE PRECISION,
    calculatedFare DOUBLE PRECISION,
    status VARCHAR(50) NOT NULL
);
