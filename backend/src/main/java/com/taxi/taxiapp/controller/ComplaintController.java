package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.model.Complaint;
import com.taxi.taxiapp.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.taxi.taxiapp.util.DataValidator;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    @Autowired
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("ComplaintController is working!");
    }

    // --- Admin Endpoints ---

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<Complaint> respondToComplaint(
            @PathVariable String id,
            @RequestBody Complaint responsePayload) {
        Complaint updated = complaintService.respondToComplaint(id, responsePayload.getAdminResponse(), responsePayload.getStatus());
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // --- User Endpoints ---

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Complaint>> getComplaintsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(complaintService.getComplaintsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<?> addComplaint(@RequestBody Complaint complaint) {
        if (complaint.getContactNumber() != null && !complaint.getContactNumber().trim().isEmpty()) {
            if (!DataValidator.isValidPhone(complaint.getContactNumber())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid contact number format.");
            }
        }
        if (complaint.getCategory() == null || complaint.getCategory().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category is required.");
        }
        return ResponseEntity.ok(complaintService.addComplaint(complaint));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaint(
            @PathVariable String id,
            @RequestBody Complaint updatedComplaint) {
        Complaint updated = complaintService.updateComplaint(id, updatedComplaint);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable String id) {
        boolean isDeleted = complaintService.deleteComplaint(id);
        if (isDeleted) {
            return ResponseEntity.ok("Complaint deleted successfully.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Complaint not found or could not be deleted.");
    }
}
