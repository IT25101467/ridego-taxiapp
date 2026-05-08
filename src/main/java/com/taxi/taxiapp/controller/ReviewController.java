package com.taxi.taxiapp.controller;

import org.springframework.web.bind.annotation.*;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final String FILE_PATH = "reviews.txt";

    @PostMapping("/add")
    public String addReview(@RequestParam String tripId, @RequestParam int rating) {

        // --- THE CHEAT CODE ---
        java.io.File file = new java.io.File(FILE_PATH);
        System.out.println("🕵️‍♂️ DEBUG: Saving review exactly here -> " + file.getAbsolutePath());
        // ----------------------

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
            writer.write(tripId + "|" + rating);
            writer.newLine();
            return "Review saved successfully!";
        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to save review.";
        }
    }



    /**
     * Catches the full review form (with comments) from the React UI
     */
    @PostMapping("/add-full")
    public String addFullReview(@RequestBody java.util.Map<String, String> payload) {
        // We use a Map to easily catch the JSON without needing to build a whole new Java Class

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
            // Build the pipe-separated line: ID|CustomerID|Rating|Comment|Date
            String line = payload.get("id") + "|" +
                    payload.get("customerId") + "|" +
                    payload.get("rating") + "|" +
                    payload.get("comment") + "|" +
                    payload.get("date");

            writer.write(line);
            writer.newLine();

            System.out.println("✅ DEBUG: Successfully wrote full review to " + new java.io.File(FILE_PATH).getAbsolutePath());
            return "Full review saved successfully!";

        } catch (IOException e) {
            e.printStackTrace();
            return "Failed to save review.";
        }
    }



    /**
     * READ: React calls this on startup to load all reviews.
     * URL: GET http://localhost:8080/api/reviews/all
     */
    @GetMapping("/all")
    public java.util.List<java.util.Map<String, Object>> getAllReviews() {
        java.util.List<java.util.Map<String, Object>> reviews = new java.util.ArrayList<>();
        java.io.File file = new java.io.File(FILE_PATH);

        // If the file doesn't exist yet, just return an empty list
        if (!file.exists()) return reviews;

        try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue; // Skip blank lines

                String[] parts = line.split("\\|");
                // Make sure the line has all 5 parts (id, customerId, rating, comment, date)
                if (parts.length >= 5) {
                    java.util.Map<String, Object> review = new java.util.HashMap<>();
                    review.put("id", parts[0]);
                    review.put("customerId", parts[1]);
                    review.put("rating", Integer.parseInt(parts[2]));
                    review.put("comment", parts[3]);
                    review.put("date", parts[4]);
                    reviews.add(review);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return reviews;
    }
}