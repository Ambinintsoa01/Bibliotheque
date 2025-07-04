    package com.bibliotheque.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "penalite")
public class Penalite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "penalite_id")
    private Long penaliteId;
    
    @ManyToOne
    @JoinColumn(name = "profil_id", nullable = false)
    private Profil profil;
    
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;
    
    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;
    
    @Column(columnDefinition = "TEXT")
    private String raisons;
    
    @ManyToOne
    @JoinColumn(name = "pret_id")
    private Pret pret;
    
    @OneToOne(mappedBy = "penalite", cascade = CascadeType.ALL)
    private PenaliteStatus penaliteStatus;
    
    // Constructors
    public Penalite() {}
    
    public Penalite(Profil profil, LocalDate dateDebut, LocalDate dateFin, BigDecimal montant, String raisons) {
        this.profil = profil;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.montant = montant;
        this.raisons = raisons;
    }
    
    // Getters and Setters
    public Long getPenaliteId() { return penaliteId; }
    public void setPenaliteId(Long penaliteId) { this.penaliteId = penaliteId; }
    
    public Profil getProfil() { return profil; }
    public void setProfil(Profil profil) { this.profil = profil; }
    
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    
    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }
    
    public String getRaisons() { return raisons; }
    public void setRaisons(String raisons) { this.raisons = raisons; }
    
    public Pret getPret() { return pret; }
    public void setPret(Pret pret) { this.pret = pret; }
    
    public PenaliteStatus getPenaliteStatus() { return penaliteStatus; }
    public void setPenaliteStatus(PenaliteStatus penaliteStatus) { this.penaliteStatus = penaliteStatus; }
}