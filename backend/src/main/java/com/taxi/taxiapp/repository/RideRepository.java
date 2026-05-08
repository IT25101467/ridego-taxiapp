package com.taxi.taxiapp.repository;

import com.taxi.taxiapp.model.RideBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RideRepository extends JpaRepository<RideBooking, Long> {

}