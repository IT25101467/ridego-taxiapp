package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * REGISTER: builds a {@link com.taxi.taxiapp.model.Passenger}, {@link com.taxi.taxiapp.model.Driver},
     * or {@link com.taxi.taxiapp.model.Admin} and persists via {@link com.taxi.taxiapp.service.UserService}.
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> userData) {
        Map<String, Object> result = userService.register(userData);
        if (Boolean.TRUE.equals(result.get("success"))) {
            System.out.println("REGISTER SUCCESS: id=" + result.get("id") + " role=" + result.get("role"));
        }
        return result;
    }

    /**
     * LOGIN: loads {@link com.taxi.taxiapp.model.User} instances from storage; returns subtype-specific fields
     * (e.g. {@code dashboardMenu} from polymorphism).
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        return userService.login(credentials);
    }

    @GetMapping("/all")
    public List<Map<String, Object>> getAllUsers() {
        return userService.getAllUsersPublic();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getUser(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateUser(@PathVariable String id, @RequestBody Map<String, String> data) {
        return userService.updateUser(id, data);
    }

    @PutMapping("/availability/{id}")
    public Map<String, Object> toggleAvailability(@PathVariable String id, @RequestParam boolean status) {
        Map<String, Object> result = userService.toggleAvailability(id, status);
        if (Boolean.TRUE.equals(result.get("success"))) {
            System.out.println("STATUS UPDATE: User " + id + " is now " + (status ? "ONLINE" : "OFFLINE"));
        }
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteUser(@PathVariable String id) {
        return userService.deleteUser(id);
    }
}
