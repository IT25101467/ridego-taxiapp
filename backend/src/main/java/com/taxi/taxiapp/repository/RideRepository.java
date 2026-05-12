package com.taxi.taxiapp.repository;

import com.taxi.taxiapp.model.RideBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<RideBooking, Long> {
List<RideBooking> findByStatus(String status);

}