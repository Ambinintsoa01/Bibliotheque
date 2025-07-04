package com.bibliotheque.entities;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "adherant_type")
public class AdherantType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 50)
    private String type;
    
    @OneToMany(mappedBy = "type", cascade = CascadeType.ALL)
    private List<Adherant> adherants;
    
    // Constructors
    public AdherantType() {}
    
    public AdherantType(String type) {
        this.type = type;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public List<Adherant> getAdherants() { return adherants; }
    public void setAdherants(List<Adherant> adherants) { this.adherants = adherants; }
}