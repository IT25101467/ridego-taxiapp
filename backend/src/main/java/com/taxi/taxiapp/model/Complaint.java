package com.taxi.taxiapp.model;

import java.time.LocalDateTime;

public class Complaint {
    private String id;
    private String userId;
    private String title;
    private String description;
    private String status; // "OPEN", "RESOLVED"
    private String adminResponse;
    private String createdAt;

    public Complaint() {}

    public Complaint(String id, String userId, String title, String description, String status, String adminResponse, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.adminResponse = adminResponse;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
