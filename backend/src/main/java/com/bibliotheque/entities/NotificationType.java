package com.bibliotheque.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_type")
public class NotificationType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;
    
    @Column(nullable = false)
    private Integer type; // 0: Rappel, 1: Penalite, 2: Disponibilite, 3: Information
    
    // Constructors
    public NotificationType() {}
    
    public NotificationType(Notification notification, Integer type) {
        this.notification = notification;
        this.type = type;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Notification getNotification() { return notification; }
    public void setNotification(Notification notification) { this.notification = notification; }
    
    public Integer getType() { return type; }
    public void setType(Integer type) { this.type = type; }
    
    public String getTypeString() {
        switch (type) {
            case 0: return "Rappel";
            case 1: return "Penalite";
            case 2: return "Disponibilite";
            case 3: return "Information";
            default: return "Inconnu";
        }
    }
}