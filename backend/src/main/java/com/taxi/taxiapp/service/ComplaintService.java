package com.taxi.taxiapp.service;

import com.taxi.taxiapp.model.Complaint;
import com.taxi.taxiapp.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    @Autowired
    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.getAllComplaints();
    }

    public List<Complaint> getComplaintsByUserId(String userId) {
        return complaintRepository.getAllComplaints().stream()
                .filter(c -> c.getUserId() != null && c.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public Complaint addComplaint(Complaint complaint) {
        complaint.setId(UUID.randomUUID().toString());
        complaint.setStatus("OPEN");
        complaint.setAdminResponse("");
        complaint.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        complaintRepository.saveComplaint(complaint);
        return complaint;
    }

    public Complaint updateComplaint(String id, Complaint updatedData) {
        List<Complaint> allComplaints = complaintRepository.getAllComplaints();
        Complaint existingComplaint = allComplaints.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (existingComplaint != null) {
            existingComplaint.setTitle(updatedData.getTitle());
            existingComplaint.setDescription(updatedData.getDescription());
            complaintRepository.updateComplaint(existingComplaint);
            return existingComplaint;
        }
        return null;
    }

    public Complaint respondToComplaint(String id, String adminResponse, String status) {
        List<Complaint> allComplaints = complaintRepository.getAllComplaints();
        Complaint existingComplaint = allComplaints.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (existingComplaint != null) {
            existingComplaint.setAdminResponse(adminResponse);
            existingComplaint.setStatus(status);
            complaintRepository.updateComplaint(existingComplaint);
            return existingComplaint;
        }
        return null;
    }

    public boolean deleteComplaint(String id) {
        List<Complaint> allComplaints = complaintRepository.getAllComplaints();
        boolean removed = allComplaints.removeIf(c -> c.getId().equals(id));
        if (removed) {
            complaintRepository.deleteComplaint(id);
        }
        return removed;
    }
}
