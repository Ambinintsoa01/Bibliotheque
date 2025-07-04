package com.bibliotheque.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "exemplaire")
public class Exemplaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exemplaire_id")
    private Long exemplaireId;
    
    @ManyToOne
    @JoinColumn(name = "livre_id", nullable = false)
    private Livre livre;
    
    @Column(name = "num_exemplaire", length = 20, nullable = false)
    private String numExemplaire;
    
    @ManyToOne
    @JoinColumn(name = "emplacement_id")
    private Emplacement emplacement;
    
    @OneToOne(mappedBy = "exemplaire", cascade = CascadeType.ALL)
    private ExemplaireEtat exemplaireEtat;
    
    @OneToMany(mappedBy = "exemplaire", cascade = CascadeType.ALL)
    private List<Pret> prets;
    
    @OneToMany(mappedBy = "exemplaire", cascade = CascadeType.ALL)
    private List<Reservation> reservations;
    
    // Constructors
    public Exemplaire() {}
    
    public Exemplaire(Livre livre, String numExemplaire) {
        this.livre = livre;
        this.numExemplaire = numExemplaire;
    }
    
    // Getters and Setters
    public Long getExemplaireId() { return exemplaireId; }
    public void setExemplaireId(Long exemplaireId) { this.exemplaireId = exemplaireId; }
    
    public Livre getLivre() { return livre; }
    public void setLivre(Livre livre) { this.livre = livre; }
    
    public String getNumExemplaire() { return numExemplaire; }
    public void setNumExemplaire(String numExemplaire) { this.numExemplaire = numExemplaire; }
    
    public Emplacement getEmplacement() { return emplacement; }
    public void setEmplacement(Emplacement emplacement) { this.emplacement = emplacement; }
    
    public ExemplaireEtat getExemplaireEtat() { return exemplaireEtat; }
    public void setExemplaireEtat(ExemplaireEtat exemplaireEtat) { this.exemplaireEtat = exemplaireEtat; }
    
    public List<Pret> getPrets() { return prets; }
    public void setPrets(List<Pret> prets) { this.prets = prets; }
    
    public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }
}