package com.taxi.taxiapp.repository;

import com.taxi.taxiapp.model.Complaint;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ComplaintRepository {
    private final String FILE_PATH = "complaints.txt";

    public ComplaintRepository() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                System.err.println("Error creating complaints file: " + e.getMessage());
            }
        }
    }

    public void saveComplaint(Complaint complaint) {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(FILE_PATH, true), StandardCharsets.UTF_8))) {
            String data = formatComplaintData(complaint);
            writer.write(data);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("Error writing to complaints file: " + e.getMessage());
        }
    }

    public List<Complaint> getAllComplaints() {
        List<Complaint> complaints = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new FileInputStream(FILE_PATH), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    complaints.add(parseComplaintData(line));
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading complaints file: " + e.getMessage());
        }
        return complaints;
    }

    public void updateComplaint(Complaint updatedComplaint) {
        List<Complaint> complaints = getAllComplaints();
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(FILE_PATH, false), StandardCharsets.UTF_8))) {
            for (Complaint c : complaints) {
                if (c.getId().equals(updatedComplaint.getId())) {
                    writer.write(formatComplaintData(updatedComplaint));
                } else {
                    writer.write(formatComplaintData(c));
                }
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error updating complaints file: " + e.getMessage());
        }
    }

    public void deleteComplaint(String id) {
        List<Complaint> complaints = getAllComplaints();
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(FILE_PATH, false), StandardCharsets.UTF_8))) {
            for (Complaint c : complaints) {
                if (!c.getId().equals(id)) {
                    writer.write(formatComplaintData(c));
                    writer.newLine();
                }
            }
        } catch (IOException e) {
            System.err.println("Error deleting complaint from file: " + e.getMessage());
        }
    }

    private String formatComplaintData(Complaint c) {
        // Replace | and newlines in description/response to avoid breaking the file format
        String desc = c.getDescription() != null ? c.getDescription().replace("|", " ").replace("\n", " ") : "";
        String title = c.getTitle() != null ? c.getTitle().replace("|", " ") : "";
        String response = c.getAdminResponse() != null ? c.getAdminResponse().replace("|", " ").replace("\n", " ") : "";
        
        return String.join("|", 
            c.getId(), 
            c.getUserId(), 
            title, 
            desc, 
            c.getStatus(), 
            response, 
            c.getCreatedAt(),
            c.getContactNumber() != null ? c.getContactNumber() : "",
            c.getCategory() != null ? c.getCategory() : ""
        );
    }

    private Complaint parseComplaintData(String line) {
        // Use -1 to keep empty trailing strings
        String[] parts = line.split("\\|", -1); 
        
        String id = parts.length > 0 ? parts[0] : "";
        String userId = parts.length > 1 ? parts[1] : "";
        String title = parts.length > 2 ? parts[2] : "";
        String desc = parts.length > 3 ? parts[3] : "";
        String status = parts.length > 4 ? parts[4] : "";
        String response = parts.length > 5 ? parts[5] : "";
        String createdAt = parts.length > 6 ? parts[6] : "";
        String contactNumber = parts.length > 7 ? parts[7] : "";
        String category = parts.length > 8 ? parts[8] : "";

        return new Complaint(id, userId, title, desc, status, response, createdAt, contactNumber, category);
    }
}
