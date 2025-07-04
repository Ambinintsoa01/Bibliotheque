package com.bibliotheque.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "inscription_status")
public class InscriptionStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inscription_id", nullable = false)
    private Inscription inscription;

    @Column(name = "statut", nullable = false)
    private int statut; // 0: Active, 1: Payée, 2: Annulée

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Inscription getInscription() { return inscription; }
    public void setInscription(Inscription inscription) { this.inscription = inscription; }
    public int getStatut() { return statut; }
    public void setStatut(int statut) { this.statut = statut; }
} 