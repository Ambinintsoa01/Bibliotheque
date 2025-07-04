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
@Table(name = "pret_status")
public class PretStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "pret_id", nullable = false)
    private Pret pret;
    
    @Column(name = "en_retard", nullable = false)
    private Boolean enRetard = false;
    
    @Column(nullable = false)
    private Boolean rendu = false;
    
    // Constructors
    public PretStatus() {}
    
    public PretStatus(Pret pret) {
        this.pret = pret;
        this.enRetard = false;
        this.rendu = false;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Pret getPret() { return pret; }
    public void setPret(Pret pret) { this.pret = pret; }
    
    public Boolean getEnRetard() { return enRetard; }
    public void setEnRetard(Boolean enRetard) { this.enRetard = enRetard; }
    
    public Boolean getRendu() { return rendu; }
    public void setRendu(Boolean rendu) { this.rendu = rendu; }
    
    public String getStatutString() {
        if (this.rendu) return "Rendu";
        if (this.enRetard) return "En retard";
        return "En cours";
    }
}