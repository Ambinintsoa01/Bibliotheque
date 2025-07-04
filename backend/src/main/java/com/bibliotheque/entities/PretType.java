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
@Table(name = "pret_type")
public class PretType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "pret_id", nullable = false)
    private Pret pret;
    
    @Column(name = "type_pret", nullable = false)
    private Integer typePret; // 0: domicile, 1: sur place
    
    // Constructors
    public PretType() {}
    
    public PretType(Pret pret, Integer typePret) {
        this.pret = pret;
        this.typePret = typePret;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Pret getPret() { return pret; }
    public void setPret(Pret pret) { this.pret = pret; }
    
    public Integer getTypePret() { return typePret; }
    public void setTypePret(Integer typePret) { this.typePret = typePret; }
    
    public String getTypePretString() {
        return typePret == 0 ? "domicile" : "sur_place";
    }

    public Integer getType() {
        return typePret;
    }

    public void setType(Integer type) {
        this.typePret = type;
    }
}