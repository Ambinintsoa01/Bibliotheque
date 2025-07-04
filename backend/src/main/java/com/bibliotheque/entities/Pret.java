package com.bibliotheque.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "pret")
public class Pret {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pret_id")
    private Long pretId;
    
    @ManyToOne
    @JoinColumn(name = "exemplaire_id", nullable = false)
    private Exemplaire exemplaire;
    
    @ManyToOne
    @JoinColumn(name = "profil_id")
    @JsonIgnoreProperties("prets") // ou @JsonManagedReference
    private Profil profil;
    
    @ManyToOne
    @JoinColumn(name = "bibliothequaire_id", nullable = false)
    private Bibliothequaire bibliothequaire;
    
    @Column(name = "date_pret", nullable = false)
    private LocalDate datePret;
    
    @Column(name = "date_fin_pret", nullable = false)
    private LocalDate dateFinPret;
    
    @Column(name = "date_rendu")
    private LocalDate dateRendu;
    
    @OneToOne(mappedBy = "pret", cascade = CascadeType.ALL)
    private PretType pretType;
    
    @OneToOne(mappedBy = "pret", cascade = CascadeType.ALL)
    private PretStatus pretStatus;
    
    @OneToMany(mappedBy = "pret", cascade = CascadeType.ALL)
    private List<ProlongementPret> prolongements;
    
    @OneToMany(mappedBy = "pret", cascade = CascadeType.ALL)
    private List<Penalite> penalites;
    
    // Constructors
    public Pret() {}
    
    public Pret(Exemplaire exemplaire, Profil profil, Bibliothequaire bibliothequaire, 
                LocalDate datePret, LocalDate dateFinPret) {
        this.exemplaire = exemplaire;
        this.profil = profil;
        this.bibliothequaire = bibliothequaire;
        this.datePret = datePret;
        this.dateFinPret = dateFinPret;
    }
    
    // Getters and Setters
    public Long getPretId() { return pretId; }
    public void setPretId(Long pretId) { this.pretId = pretId; }
    
    public Exemplaire getExemplaire() { return exemplaire; }
    public void setExemplaire(Exemplaire exemplaire) { this.exemplaire = exemplaire; }
    
    public Profil getProfil() { return profil; }
    public void setProfil(Profil profil) { this.profil = profil; }
    
    public Bibliothequaire getBibliothequaire() { return bibliothequaire; }
    public void setBibliothequaire(Bibliothequaire bibliothequaire) { this.bibliothequaire = bibliothequaire; }
    
    public LocalDate getDatePret() { return datePret; }
    public void setDatePret(LocalDate datePret) { this.datePret = datePret; }
    
    public LocalDate getDateFinPret() { return dateFinPret; }
    public void setDateFinPret(LocalDate dateFinPret) { this.dateFinPret = dateFinPret; }
    
    public LocalDate getDateRendu() { return dateRendu; }
    public void setDateRendu(LocalDate dateRendu) { this.dateRendu = dateRendu; }
    
    public PretType getPretType() { return pretType; }
    public void setPretType(PretType pretType) { this.pretType = pretType; }
    
    public PretStatus getPretStatus() { return pretStatus; }
    public void setPretStatus(PretStatus pretStatus) { this.pretStatus = pretStatus; }
    
    public List<ProlongementPret> getProlongements() { return prolongements; }
    public void setProlongements(List<ProlongementPret> prolongements) { this.prolongements = prolongements; }
    
    public List<Penalite> getPenalites() { return penalites; }
    public void setPenalites(List<Penalite> penalites) { this.penalites = penalites; }
}