package com.bibliotheque.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_status")
public class NotificationStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;
    
    @Column(nullable = false)
    private Integer statut = 0; // 0: Non lu, 1: Lu
    
    // Constructors
    public NotificationStatus() {}
    
    public NotificationStatus(Notification notification) {
        this.notification = notification;
        this.statut = 0;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Notification getNotification() { return notification; }
    public void setNotification(Notification notification) { this.notification = notification; }
    
    public Integer getStatut() { return statut; }
    public void setStatut(Integer statut) { this.statut = statut; }
    
    public String getStatutString() {
        return statut == 0 ? "Non lu" : "Lu";
    }
}