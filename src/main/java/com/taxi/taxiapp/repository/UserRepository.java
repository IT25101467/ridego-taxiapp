package com.taxi.taxiapp.repository;

import com.taxi.taxiapp.model.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class UserRepository {
    // The filename for storage, similar to the sample project's 'users.txt' [cite: 7, 123]
    private final String FILE_PATH = "users.txt";

    /**
     * FILE WRITING: This saves a user to the text file.
     * Hits the 'Create' requirement for CRUD[cite: 99, 107].
     */
    public void saveUser(User user) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
            String userData = user.getId() + "|" + user.getName() + "|" + user.getEmail() + "|" +
                    user.getPassword() + "|" + user.getPhoneNumber();

            // If it's a driver, we add their specific license and status
            if (user instanceof Driver) {
                Driver d = (Driver) user;
                userData += "|" + d.getLicenseNumber() + "|" + d.isAvailable();
            }

            writer.write(userData);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("Error writing to file: " + e.getMessage());
        }
    }

    /**
     * FILE READING: This loads all users from the file.
     * Hits the 'Read' requirement for CRUD[cite: 99, 107].
     */
    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] data = line.split("\\|");
                // Logic to recreate Passenger or Driver objects goes here...
                // (We'll refine the parsing logic as we build the Service layer)
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
        return users;
    }
}