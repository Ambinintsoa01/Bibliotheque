package com.bibliotheque.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "categorie")
public class Categorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "categorie_id")
    private Long categorieId;
    
    @Column(length = 50, nullable = false, unique = true)
    private String nom;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "categorie_parent_id")
    private Categorie categorieParent;
    
    @OneToMany(mappedBy = "categorieParent", cascade = CascadeType.ALL)
    private List<Categorie> sousCategories;
    
    @ManyToMany(mappedBy = "categories")
    private List<Livre> livres;
    
    // Constructors
    public Categorie() {}
    
    public Categorie(String nom) {
        this.nom = nom;
    }
    
    // Getters and Setters
    public Long getCategorieId() { return categorieId; }
    public void setCategorieId(Long categorieId) { this.categorieId = categorieId; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Categorie getCategorieParent() { return categorieParent; }
    public void setCategorieParent(Categorie categorieParent) { this.categorieParent = categorieParent; }
    
    public List<Categorie> getSousCategories() { return sousCategories; }
    public void setSousCategories(List<Categorie> sousCategories) { this.sousCategories = sousCategories; }
    
    public List<Livre> getLivres() { return livres; }
    public void setLivres(List<Livre> livres) { this.livres = livres; }
}