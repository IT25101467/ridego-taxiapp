package com.taxi.taxiapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taxi.taxiapp.model.User;
import com.taxi.taxiapp.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ✅ REGISTER
    public User registerUser(User user) {
        return userRepository.save(user);
    }

}