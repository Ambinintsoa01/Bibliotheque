package com.bibliotheque.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "auteur")
public class Auteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auteur_id")
    private Long auteurId;
    
    @Column(length = 50, nullable = false)
    private String nom;
    
    @Column(length = 50)
    private String prenom;
    
    @Column(length = 50)
    private String nationalite;
    
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    
    @Column(name = "date_deces")
    private LocalDate dateDeces;
    
    @Column(columnDefinition = "TEXT")
    private String biographie;
    
    @ManyToMany(mappedBy = "auteurs")
    private List<Livre> livres;
    
    // Constructors
    public Auteur() {}
    
    public Auteur(String nom, String prenom) {
        this.nom = nom;
        this.prenom = prenom;
    }
    
    // Getters and Setters
    public Long getAuteurId() { return auteurId; }
    public void setAuteurId(Long auteurId) { this.auteurId = auteurId; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public String getNationalite() { return nationalite; }
    public void setNationalite(String nationalite) { this.nationalite = nationalite; }
    
    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }
    
    public LocalDate getDateDeces() { return dateDeces; }
    public void setDateDeces(LocalDate dateDeces) { this.dateDeces = dateDeces; }
    
    public String getBiographie() { return biographie; }
    public void setBiographie(String biographie) { this.biographie = biographie; }
    
    public List<Livre> getLivres() { return livres; }
    public void setLivres(List<Livre> livres) { this.livres = livres; }
}