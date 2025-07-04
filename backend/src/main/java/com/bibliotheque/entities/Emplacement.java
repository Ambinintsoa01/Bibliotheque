package com.bibliotheque.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "emplacement")
public class Emplacement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emplacement_id")
    private Long emplacementId;
    
    @Column(length = 50, nullable = false)
    private String nom;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 50)
    private String salle;
    
    @Column(length = 20)
    private String etagere;
    
    @Column(length = 20)
    private String position;
    
    @OneToMany(mappedBy = "emplacement", cascade = CascadeType.ALL)
    private List<Exemplaire> exemplaires;
    
    // Constructors
    public Emplacement() {}
    
    public Emplacement(String nom, String salle, String etagere, String position) {
        this.nom = nom;
        this.salle = salle;
        this.etagere = etagere;
        this.position = position;
    }
    
    // Getters and Setters
    public Long getEmplacementId() { return emplacementId; }
    public void setEmplacementId(Long emplacementId) { this.emplacementId = emplacementId; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getSalle() { return salle; }
    public void setSalle(String salle) { this.salle = salle; }
    
    public String getEtagere() { return etagere; }
    public void setEtagere(String etagere) { this.etagere = etagere; }
    
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    
    public List<Exemplaire> getExemplaires() { return exemplaires; }
    public void setExemplaires(List<Exemplaire> exemplaires) { this.exemplaires = exemplaires; }
}