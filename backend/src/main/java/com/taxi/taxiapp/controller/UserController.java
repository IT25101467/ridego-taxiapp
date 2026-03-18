package com.taxi.taxiapp.controller;

import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final String FILE_PATH = "users.txt";

    /**
     * REGISTER: Saves a new user to the bottom of users.txt
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> userData) {
        String name = userData.get("name");
        String email = userData.get("email");
        String password = userData.get("password");
        String role = userData.get("role");
        String phone = userData.get("phone");

        // 1. Generate a unique ID (c for customer, d for driver)
        String prefix = role.equalsIgnoreCase("driver") ? "d" : "c";
        String id = prefix + (System.currentTimeMillis() % 100000); // Short unique ID

        // 2. Format: ID|Name|Email|Password|Role|Phone|Available
        String newLine = String.join("|", id, name, email, password, role, phone, "true");

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
            writer.write(newLine);
            writer.newLine();

            System.out.println("✅ REGISTER SUCCESS: New " + role + " created with ID " + id);
            return Map.of("success", true, "id", id);
        } catch (IOException e) {
            e.printStackTrace();
            return Map.of("error", "Database write failed.");
        }
    }

    /**
     * LOGIN: Checks if email/password/role matches a line in users.txt
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String role = credentials.get("role");

        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] p = line.split("\\|");
                if (p.length >= 7) {
                    if (p[2].equals(email) && p[3].equals(password) && p[4].equalsIgnoreCase(role)) {
                        Map<String, Object> user = new HashMap<>();
                        user.put("id", p[0]);
                        user.put("name", p[1]);
                        user.put("email", p[2]);
                        user.put("role", p[4]);
                        user.put("phone", p[5]);
                        user.put("available", Boolean.parseBoolean(p[6]));
                        return user;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Map.of("error", "Invalid email or password.");
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
                    user.put("phone", p[5]);
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