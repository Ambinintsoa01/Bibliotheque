package com.bibliotheque.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "editeur")
public class Editeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "editeur_id")
    private Long editeurId;
    
    @Column(length = 100, nullable = false)
    private String nom;
    
    @Column(columnDefinition = "TEXT")
    private String adresse;
    
    @Column(length = 100)
    private String contact;
    
    @Column(name = "site_web", length = 255)
    private String siteWeb;
    
    @OneToMany(mappedBy = "editeur", cascade = CascadeType.ALL)
    private List<Livre> livres;
    
    // Constructors
    public Editeur() {}
    
    public Editeur(String nom) {
        this.nom = nom;
    }
    
    // Getters and Setters
    public Long getEditeurId() { return editeurId; }
    public void setEditeurId(Long editeurId) { this.editeurId = editeurId; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    
    public String getSiteWeb() { return siteWeb; }
    public void setSiteWeb(String siteWeb) { this.siteWeb = siteWeb; }
    
    public List<Livre> getLivres() { return livres; }
    public void setLivres(List<Livre> livres) { this.livres = livres; }
}