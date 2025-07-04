package com.bibliotheque.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "penalite_status")
public class PenaliteStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "penalite_id", nullable = false)
    private Penalite penalite;
    
    @Column(nullable = false)
    private Integer statut = 0; // 0: Active, 1: Payée, 2: Annulée
    
    // Constructors
    public PenaliteStatus() {}
    
    public PenaliteStatus(Penalite penalite) {
        this.penalite = penalite;
        this.statut = 0;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Penalite getPenalite() { return penalite; }
    public void setPenalite(Penalite penalite) { this.penalite = penalite; }
    
    public Integer getStatut() { return statut; }
    public void setStatut(Integer statut) { this.statut = statut; }
    
    public String getStatutString() {
        switch (statut) {
            case 0: return "Active";
            case 1: return "Payée";
            case 2: return "Annulée";
            default: return "Inconnu";
        }
    }
}