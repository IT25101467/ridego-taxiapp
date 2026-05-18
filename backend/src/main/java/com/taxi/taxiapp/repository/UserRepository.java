package com.taxi.taxiapp.repository;

import com.taxi.taxiapp.model.*;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Persistence for {@link User} and subclasses. File format (pipe-separated):
 * <ul>
 *   <li>Passenger (customer): {@code id|name|email|password|customer|phone|true}</li>
 *   <li>Driver: {@code id|name|email|password|driver|phone|available|license}</li>
 *   <li>Admin: {@code id|name|email|password|admin|phone|true|adminRole}</li>
 * </ul>
 * Legacy 7-field driver lines (no license column) are still loaded; license defaults to {@code N/A}.
 */
@Repository
public class UserRepository {

    private final String filePath;

    public UserRepository() {
        this("users.txt");
    }

    public UserRepository(String filePath) {
        this.filePath = filePath;
    }

    public List<User> loadAll() {
        List<User> users = new ArrayList<>();
        File file = new File(filePath);
        if (!file.exists()) {
            return users;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }
                String[] parts = line.split("\\|", -1);
                User user = parseLine(parts);
                if (user != null) {
                    users.add(user);
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading users file: " + e.getMessage());
        }
        return users;
    }

    public void append(User user) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
            writer.write(formatLine(user));
            writer.newLine();
        }
    }

    /** Rewrites the entire file from the in-memory list (used after update/delete). */
    public void saveAll(List<User> users) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, false))) {
            for (User u : users) {
                writer.write(formatLine(u));
                writer.newLine();
            }
        }
    }

    User parseLine(String[] p) {
        if (p.length < 7) {
            return null;
        }
        String id = p[0];
        String name = p[1];
        String email = p[2];
        String password = p[3];
        String role = p[4].trim().toLowerCase();
        String phone = p[5];
        boolean available = Boolean.parseBoolean(p[6]);

        switch (role) {
            case "driver": {
                String license = (p.length > 7 && !p[7].isBlank()) ? p[7] : "N/A";
                return new Driver(id, name, email, password, phone, license, available);
            }
            case "admin": {
                String adminRole = (p.length > 7 && !p[7].isBlank()) ? p[7] : "Dispatcher";
                return new Admin(id, name, email, password, phone, adminRole);
            }
            case "customer":
                return new Passenger(id, name, email, password, phone);
            default:
                return null;
        }
    }

    String formatLine(User user) {
        String base = String.join("|",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRoleKey(),
                user.getPhoneNumber());

        if (user instanceof Driver) {
            Driver d = (Driver) user;
            return base + "|" + d.isAvailable() + "|" + d.getLicenseNumber();
        }
        if (user instanceof Admin) {
            Admin a = (Admin) user;
            return base + "|" + true + "|" + a.getAdminRole();
        }
        return base + "|" + true;
    }
}
