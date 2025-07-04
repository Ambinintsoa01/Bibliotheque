package com.bibliotheque.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "bibliothequaire")
public class Bibliothequaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bibliothequaire_id")
    private Long bibliothequaireId;
    
    @Column(length = 100, nullable = false)
    private String nom;
    
    @Column(length = 100, nullable = false, unique = true)
    private String email;
    
    @Column(length = 255, nullable = false)
    private String pwd;
    
    @OneToMany(mappedBy = "bibliothequaire", cascade = CascadeType.ALL)
    private List<Pret> prets;
    
    // Constructors
    public Bibliothequaire() {}
    
    public Bibliothequaire(String nom, String email, String pwd) {
        this.nom = nom;
        this.email = email;
        this.pwd = pwd;
    }
    
    // Getters and Setters
    public Long getBibliothequaireId() { return bibliothequaireId; }
    public void setBibliothequaireId(Long bibliothequaireId) { this.bibliothequaireId = bibliothequaireId; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPwd() { return pwd; }
    public void setPwd(String pwd) { this.pwd = pwd; }
    
    public List<Pret> getPrets() { return prets; }
    public void setPrets(List<Pret> prets) { this.prets = prets; }
}