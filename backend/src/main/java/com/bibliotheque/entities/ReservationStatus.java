package com.bibliotheque.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "reservation_status")
public class ReservationStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
    
    @Column(nullable = false)
    private Integer statut = 0; // 0: En attente, 1: Disponible, 2: Annulée, 3: Expirée
    
    // Constructors
    public ReservationStatus() {}
    
    public ReservationStatus(Reservation reservation) {
        this.reservation = reservation;
        this.statut = 0;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Reservation getReservation() { return reservation; }
    public void setReservation(Reservation reservation) { this.reservation = reservation; }
    
    public Integer getStatut() { return statut; }
    public void setStatut(Integer statut) { this.statut = statut; }
    
    public String getStatutString() {
        switch (statut) {
            case 0: return "En attente";
            case 1: return "Disponible";
            case 2: return "Annulée";
            case 3: return "Expirée";
            default: return "Inconnu";
        }
    }
}