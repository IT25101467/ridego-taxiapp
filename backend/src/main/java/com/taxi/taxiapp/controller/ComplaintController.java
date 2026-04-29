package com.taxi.taxiapp.controller;

import com.taxi.taxiapp.model.Complaint;
import com.taxi.taxiapp.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*") // Allows requests from the React frontend
public class ComplaintController {

    private final ComplaintService complaintService;

    @Autowired
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
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
    public ResponseEntity<Complaint> addComplaint(@RequestBody Complaint complaint) {
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
}
