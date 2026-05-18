package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.model.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/fares")
public class FareController {

    @GetMapping("/calculate")
    public Map<String, Object> calculateFare(@RequestParam double distance, @RequestParam String vehicleType) {
        Vehicle vehicle = null;
        double ratePerKm = 0;
        
        switch (vehicleType.toLowerCase()) {
            case "car":
                vehicle = new Car("temp", "temp", "temp");
                ratePerKm = 120.0;
                break;
            case "tuk":
                vehicle = new Tuk("temp", "temp", "temp");
                ratePerKm = 80.0;
                break;
            case "van":
                vehicle = new Van("temp", "temp", "temp");
                ratePerKm = 150.0;
                break;
            case "bike":
                vehicle = new Bike("temp", "temp", "temp");
                ratePerKm = 50.0;
                break;
            default:
                throw new IllegalArgumentException("Unknown vehicle type: " + vehicleType);
        }

        double fare = vehicle.calculateFare(distance);
        Map<String, Object> response = new HashMap<>();
        response.put("fare", fare);
        response.put("ratePerKm", vehicle.getRatePerKm());
        response.put("baseFare", vehicle.getBaseFare());
        return response;
    }

    @GetMapping("/rates")
    public Map<String, Map<String, Double>> getRates() {
        Map<String, Map<String, Double>> rates = new HashMap<>();
        
        Vehicle[] vehicles = {
            new Car("temp", "temp", "temp"),
            new Tuk("temp", "temp", "temp"),
            new Van("temp", "temp", "temp"),
            new Bike("temp", "temp", "temp")
        };

        for (Vehicle v : vehicles) {
            Map<String, Double> vehicleRates = new HashMap<>();
            vehicleRates.put("baseFare", v.getBaseFare());
            vehicleRates.put("ratePerKm", v.getRatePerKm());
            
            String name = v.getClass().getSimpleName();
            rates.put(name, vehicleRates);
        }
        
        return rates;
    }
}
