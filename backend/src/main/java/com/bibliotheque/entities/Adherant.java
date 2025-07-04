package com.bibliotheque.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "adherant")
public class Adherant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adherant_id")
    private Long adherantId;
    
    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private AdherantType type;
    
    @OneToOne(mappedBy = "adherant", cascade = CascadeType.ALL)
    private Profil profil;
    
    // Constructors
    public Adherant() {}
    
    public Adherant(AdherantType type) {
        this.type = type;
    }
    
    // Getters and Setters
    public Long getAdherantId() { return adherantId; }
    public void setAdherantId(Long adherantId) { this.adherantId = adherantId; }
    
    public AdherantType getType() { return type; }
    public void setType(AdherantType type) { this.type = type; }
    
    public Profil getProfil() { return profil; }
    public void setProfil(Profil profil) { this.profil = profil; }
}