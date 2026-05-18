package com.taxi.taxiapp.service;

import com.taxi.taxiapp.model.*;
import com.taxi.taxiapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Application layer: works with {@link User} subtypes (OOP) and delegates persistence to {@link UserRepository}.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> register(Map<String, String> userData) {
        String name = userData.get("name");
        String email = userData.get("email");
        String password = userData.get("password");
        String roleRaw = userData.get("role");
        String phone = userData.get("phone");

        if (name == null || email == null || password == null || roleRaw == null || phone == null) {
            return Map.of("error", "Missing required fields.");
        }

        String role = roleRaw.trim().toLowerCase();
        String id = nextId(role);

        User user;
        switch (role) {
            case "driver": {
                String license = Optional.ofNullable(userData.get("licenseNumber")).filter(s -> !s.isBlank()).orElse("N/A");
                user = new Driver(id, name, email, password, phone, license, true);
                break;
            }
            case "admin": {
                String adminRole = Optional.ofNullable(userData.get("adminRole")).filter(s -> !s.isBlank()).orElse("Dispatcher");
                user = new Admin(id, name, email, password, phone, adminRole);
                break;
            }
            case "customer":
                user = new Passenger(id, name, email, password, phone);
                break;
            default:
                return Map.of("error", "Unknown role: " + roleRaw);
        }

        try {
            userRepository.append(user);
        } catch (IOException e) {
            e.printStackTrace();
            return Map.of("error", "Database write failed.");
        }

        Map<String, Object> ok = new LinkedHashMap<>();
        ok.put("success", true);
        ok.put("id", id);
        ok.put("role", user.getRoleKey());
        ok.put("dashboardMenu", user.getDashboardMenu());
        return ok;
    }

    public Map<String, Object> login(Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String role = credentials.get("role");
        if (email == null || password == null || role == null) {
            return Map.of("error", "Invalid email or password.");
        }
        String wantedRole = role.trim().toLowerCase();

        for (User user : userRepository.loadAll()) {
            if (user.getEmail().equals(email)
                    && user.getPassword().equals(password)
                    && user.getRoleKey().equalsIgnoreCase(wantedRole)) {
                return toPublicMap(user);
            }
        }
        return Map.of("error", "Invalid email or password.");
    }

    public List<Map<String, Object>> getAllUsersPublic() {
        return userRepository.loadAll().stream()
                .map(this::toPublicMap)
                .collect(Collectors.toList());
    }

    public Map<String, Object> toggleAvailability(String id, boolean status) {
        List<User> users = userRepository.loadAll();
        boolean found = false;
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            if (!u.getId().equals(id)) {
                continue;
            }
            if (u instanceof Driver) {
                ((Driver) u).setAvailable(status);
                found = true;
            } else {
                return Map.of("error", "Availability applies to drivers only.");
            }
            break;
        }
        if (!found) {
            return Map.of("success", false);
        }
        try {
            userRepository.saveAll(users);
        } catch (IOException e) {
            return Map.of("error", "Failed to update database.");
        }
        return Map.of("success", true);
    }

    public Map<String, Object> getUserById(String id) {
        for (User user : userRepository.loadAll()) {
            if (user.getId().equals(id)) {
                Map<String, Object> result = new LinkedHashMap<>(toPublicMap(user));
                result.put("success", true);
                return result;
            }
        }
        return Map.of("error", "User not found.");
    }

    public Map<String, Object> updateUser(String id, Map<String, String> data) {
        List<User> users = userRepository.loadAll();
        User target = null;
        for (User u : users) {
            if (u.getId().equals(id)) {
                target = u;
                break;
            }
        }
        if (target == null) {
            return Map.of("error", "User not found.");
        }

        String name = data.get("name");
        String phone = data.get("phone");
        String currentPassword = data.get("currentPassword");
        String newPassword = data.get("newPassword");

        if (name != null && !name.isBlank()) {
            target.setName(name.trim());
        }
        if (phone != null && !phone.isBlank()) {
            target.setPhoneNumber(phone.trim());
        }
        if (newPassword != null && !newPassword.isBlank()) {
            if (currentPassword == null || !target.getPassword().equals(currentPassword)) {
                return Map.of("error", "Current password is incorrect.");
            }
            target.setPassword(newPassword);
        }

        try {
            userRepository.saveAll(users);
        } catch (IOException e) {
            return Map.of("error", "Failed to update database.");
        }

        Map<String, Object> result = new LinkedHashMap<>(toPublicMap(target));
        result.put("success", true);
        return result;
    }

    public Map<String, Object> deleteUser(String id) {
        List<User> users = userRepository.loadAll();
        List<User> kept = users.stream().filter(u -> !u.getId().equals(id)).collect(Collectors.toList());
        boolean deleted = kept.size() < users.size();
        if (!deleted) {
            return Map.of("success", false);
        }
        try {
            userRepository.saveAll(kept);
        } catch (IOException e) {
            return Map.of("error", "Write failed");
        }
        return Map.of("success", true);
    }

    private String nextId(String role) {
        String prefix;
        switch (role) {
            case "driver":
                prefix = "d";
                break;
            case "admin":
                prefix = "a";
                break;
            default:
                prefix = "c";
        }
        return prefix + (System.currentTimeMillis() % 100000);
    }

    /** Public user JSON: no password; includes polymorphic {@code dashboardMenu}. */
    private Map<String, Object> toPublicMap(User user) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", user.getId());
        m.put("name", user.getName());
        m.put("email", user.getEmail());
        m.put("role", user.getRoleKey());
        m.put("phone", user.getPhoneNumber());
        m.put("dashboardMenu", user.getDashboardMenu());
        if (user instanceof Driver) {
            Driver d = (Driver) user;
            m.put("available", d.isAvailable());
            m.put("licenseNumber", d.getLicenseNumber());
        } else {
            m.put("available", true);
        }
        if (user instanceof Admin) {
            m.put("adminRole", ((Admin) user).getAdminRole());
        }
        return m;
    }
}
