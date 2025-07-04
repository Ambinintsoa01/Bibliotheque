package com.bibliotheque.entities;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;
    
    @ManyToOne
    @JoinColumn(name = "profil_id", nullable = false)
    private Profil profil;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(name = "date_envoi", nullable = false)
    private LocalDateTime dateEnvoi;
    
    @OneToOne(mappedBy = "notification", cascade = CascadeType.ALL)
    private NotificationType notificationType;
    
    @OneToOne(mappedBy = "notification", cascade = CascadeType.ALL)
    private NotificationStatus notificationStatus;
    
    // Constructors
    public Notification() {}
    
    public Notification(Profil profil, String message, LocalDateTime dateEnvoi) {
        this.profil = profil;
        this.message = message;
        this.dateEnvoi = dateEnvoi;
    }
    
    // Getters and Setters
    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }
    
    public Profil getProfil() { return profil; }
    public void setProfil(Profil profil) { this.profil = profil; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public LocalDateTime getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(LocalDateTime dateEnvoi) { this.dateEnvoi = dateEnvoi; }
    
    public NotificationType getNotificationType() { return notificationType; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }
    
    public NotificationStatus getNotificationStatus() { return notificationStatus; }
    public void setNotificationStatus(NotificationStatus notificationStatus) { this.notificationStatus = notificationStatus; }
}