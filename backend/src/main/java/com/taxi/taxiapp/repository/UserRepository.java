package com.taxi.taxiapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taxi.taxiapp.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
}