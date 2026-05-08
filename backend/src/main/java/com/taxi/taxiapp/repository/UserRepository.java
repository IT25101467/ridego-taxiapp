package com.taxi.taxiapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taxi.taxiapp.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

}