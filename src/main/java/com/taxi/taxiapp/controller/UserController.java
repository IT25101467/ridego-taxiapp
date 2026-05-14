package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.model.UserEntity;
import com.taxi.taxiapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * REGISTER: Saves a new user to the database
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> userData) {
        String name = userData.get("name");
        String email = userData.get("email");
        String password = userData.get("password");
        String role = userData.get("role");
        String phone = userData.get("phone");

        try {
            UserEntity newUser = new UserEntity(name, email, password, role, phone, true);
            UserEntity savedUser = userRepository.save(newUser);
            
            System.out.println("✅ REGISTER SUCCESS: New " + role + " created with ID " + savedUser.getId());
            return Map.of("success", true, "id", savedUser.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "Database write failed.");
        }
    }

    /**
     * LOGIN: Checks if email/password/role matches a record in the database
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String role = credentials.get("role");

        try {
            Optional<UserEntity> userOpt = userRepository.findByEmail(email);

            if (userOpt.isPresent()) {
                UserEntity userEntity = userOpt.get();
                if (userEntity.getPassword().equals(password) && userEntity.getRole().equalsIgnoreCase(role)) {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", userEntity.getId().toString()); // Convert to string for frontend
                    userMap.put("name", userEntity.getName());
                    userMap.put("email", userEntity.getEmail());
                    userMap.put("role", userEntity.getRole());
                    userMap.put("phone", userEntity.getPhone());
                    userMap.put("available", userEntity.getAvailable());
                    return userMap;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Map.of("error", "Invalid email or password.");
    }

    /**
     * GET ALL: Used by the Admin to see everyone in the system
     */
    @GetMapping("/all")
    public List<Map<String, Object>> getAllUsers() {
        try {
            List<UserEntity> allUsers = userRepository.findAll();
            
            List<Map<String, Object>> users = new ArrayList<>();
            for (UserEntity u : allUsers) {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", u.getId().toString());
                userMap.put("name", u.getName());
                userMap.put("email", u.getEmail());
                userMap.put("role", u.getRole());
                userMap.put("phone", u.getPhone());
                userMap.put("available", u.getAvailable());
                users.add(userMap);
            }
            return users;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * TOGGLE AVAILABILITY: Updates the 'available' column
     */
    @PutMapping("/availability/{id}")
    public Map<String, Object> toggleAvailability(@PathVariable Integer id, @RequestParam boolean status) {
        try {
            Optional<UserEntity> userOpt = userRepository.findById(id);
            if (userOpt.isPresent()) {
                UserEntity user = userOpt.get();
                user.setAvailable(status);
                userRepository.save(user);
                System.out.println("🔄 STATUS UPDATE: User " + id + " is now " + (status ? "ONLINE" : "OFFLINE"));
                return Map.of("success", true);
            } else {
                return Map.of("error", "User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "Failed to update database.");
        }
    }

    /**
     * DELETE USER: Removes a user from database
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteUser(@PathVariable Integer id) {
        try {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                return Map.of("success", true);
            }
            return Map.of("success", false);
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "Delete failed");
        }
    }
}