package com.bibliotheque.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "exemplaire_etat")
public class ExemplaireEtat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "exemplaire_id", nullable = false)
    private Exemplaire exemplaire;
    
    @Column(nullable = false)
    private Integer etat = 0; // 0: Neuf, 1: Bon, 2: Moyen, 3: Mauvais, 4: Hors service
    
    @Column(name = "date_acquisition", nullable = false)
    private LocalDate dateAcquisition;
    
    // Constructors
    public ExemplaireEtat() {}
    
    public ExemplaireEtat(Exemplaire exemplaire, Integer etat, LocalDate dateAcquisition) {
        this.exemplaire = exemplaire;
        this.etat = etat;
        this.dateAcquisition = dateAcquisition;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Exemplaire getExemplaire() { return exemplaire; }
    public void setExemplaire(Exemplaire exemplaire) { this.exemplaire = exemplaire; }
    
    public Integer getEtat() { return etat; }
    public void setEtat(Integer etat) { this.etat = etat; }
    
    public LocalDate getDateAcquisition() { return dateAcquisition; }
    public void setDateAcquisition(LocalDate dateAcquisition) { this.dateAcquisition = dateAcquisition; }
    
    public String getEtatString() {
        switch (etat) {
            case 0: return "Neuf";
            case 1: return "Bon";
            case 2: return "Moyen";
            case 3: return "Mauvais";
            case 4: return "Hors service";
            default: return "Inconnu";
        }
    }
}