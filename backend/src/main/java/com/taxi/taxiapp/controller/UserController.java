
package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.model.User;
import com.taxi.taxiapp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final String FILE_PATH = "users.txt";

    /**
     * REGISTER: Saves a new user to the bottom of users.txt
     */
   @PostMapping("/register")
public Map<String, Object> register(@RequestBody Map<String, String> userData) {

    Map<String, Object> response = new HashMap<>();

    try {

        User user = new User();

        user.setName(userData.get("name"));
        user.setEmail(userData.get("email"));
        user.setPassword(userData.get("password"));
        user.setRole(userData.get("role"));
        user.setPhoneNumber(userData.get("phone"));

        User savedUser = userRepository.save(user);

        response.put("success", true);
        response.put("id", savedUser.getId());

        System.out.println("✅ USER SAVED TO DATABASE");

        return response;

    } catch (Exception e) {
        e.printStackTrace();

        response.put("error", "Registration failed");

        return response;
    }
}

    /**
     * LOGIN: Checks if email/password/role matches a line in users.txt
     */
  
@PostMapping("/login")
public Map<String, Object> login(@RequestBody Map<String, String> loginData) {

    Map<String, Object> response = new HashMap<>();

    String email = loginData.get("email");
    String password = loginData.get("password");
    String role = loginData.get("role");

    Optional<User> optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isPresent()) {

        User user = optionalUser.get();

        if (
            user.getPassword().equals(password)
            && user.getRole().equalsIgnoreCase(role)
        ) {

            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("phone", user.getPhoneNumber());

            return response;
        }
    }

    response.put("error", "Invalid email or password");
    return response;
}

    /**
     * GET ALL: Used by the Admin to see everyone in the system
     */
    @GetMapping("/all")
    public List<Map<String, Object>> getAllUsers() {
        List<Map<String, Object>> users = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] p = line.split("\\|");
                if (p.length >= 7) {
                    Map<String, Object> user = new HashMap<>();
                    user.put("id", p[0]);
                    user.put("name", p[1]);
                    user.put("email", p[2]);
                    user.put("role", p[4]);
                    user.put("phoneNumber", p[5]);
                    user.put("available", Boolean.parseBoolean(p[6]));
                    users.add(user);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return users;
    }

    //DRIVWE ONLINE TOGGLE
    /**
     * TOGGLE AVAILABILITY: Updates the 'Available' column in users.txt
     * URL: PUT http://localhost:8080/api/users/availability/{id}?status=true
     */
    @PutMapping("/availability/{id}")
    public Map<String, Object> toggleAvailability(@PathVariable String id, @RequestParam boolean status) {
        List<String> lines = new ArrayList<>();
        boolean found = false;

        // 1. READ the entire file into memory
        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] p = line.split("\\|");
                if (p[0].equals(id)) {
                    // 2. MODIFY the specific line (Index 6 is the Available status)
                    p[6] = String.valueOf(status);
                    line = String.join("|", p);
                    found = true;
                }
                lines.add(line);
            }
        } catch (IOException e) {
            return Map.of("error", "Failed to read database.");
        }

        // 3. WRITE everything back to the file
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH))) {
            for (String l : lines) {
                writer.write(l);
                writer.newLine();
            }
        } catch (IOException e) {
            return Map.of("error", "Failed to update database.");
        }

        System.out.println("🔄 STATUS UPDATE: User " + id + " is now " + (status ? "ONLINE" : "OFFLINE"));
        return Map.of("success", found);
    }


    /**
     * DELETE USER: Removes a user from users.txt
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteUser(@PathVariable String id) {
        List<String> lines = new ArrayList<>();
        boolean deleted = false;

        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.startsWith(id + "|")) { // Keep everything EXCEPT the user we want to delete
                    lines.add(line);
                } else {
                    deleted = true;
                }
            }
        } catch (IOException e) { return Map.of("error", "Read failed"); }

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH))) {
            for (String l : lines) {
                writer.write(l);
                writer.newLine();
            }
        } catch (IOException e) { return Map.of("error", "Write failed"); }

        return Map.of("success", deleted);
    }


}