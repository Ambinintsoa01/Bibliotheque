package com.bibliotheque.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "prolongement_pret")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProlongementPret {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prolongement_id")
    private Long prolongementId;
    
    @ManyToOne
    @JoinColumn(name = "pret_id", nullable = false)
    private Pret pret;
    
    @Column(name = "date_demande", nullable = false)
    private LocalDateTime dateDemande;
    
    @Column(name = "nouvelle_date_fin", nullable = false)
    private LocalDateTime nouvelleDateFin;
    
    @Column(nullable = false)
    private Integer statut = 0; // 0: En attente, 1: Approuvé, 2: Refusé
    
    @Column(name = "motif_refus", columnDefinition = "TEXT")
    private String motifRefus;
    
    // Constructors
    public ProlongementPret() {}
    
    public ProlongementPret(Pret pret, LocalDateTime dateDemande, LocalDateTime nouvelleDateFin) {
        this.pret = pret;
        this.dateDemande = dateDemande;
        this.nouvelleDateFin = nouvelleDateFin;
    }
    
    // Getters and Setters
    public Long getProlongementId() { return prolongementId; }
    public void setProlongementId(Long prolongementId) { this.prolongementId = prolongementId; }
    
    public Pret getPret() { return pret; }
    public void setPret(Pret pret) { this.pret = pret; }
    
    public LocalDateTime getDateDemande() { return dateDemande; }
    public void setDateDemande(LocalDateTime dateDemande) { this.dateDemande = dateDemande; }
    
    public LocalDateTime getNouvelleDateFin() { return nouvelleDateFin; }
    public void setNouvelleDateFin(LocalDateTime nouvelleDateFin) { this.nouvelleDateFin = nouvelleDateFin; }
    
    public Integer getStatut() { return statut; }
    public void setStatut(Integer statut) { this.statut = statut; }
    
    public String getMotifRefus() { return motifRefus; }
    public void setMotifRefus(String motifRefus) { this.motifRefus = motifRefus; }
    
    public String getStatutString() {
        switch (statut) {
            case 0: return "En attente";
            case 1: return "Approuvé";
            case 2: return "Refusé";
            default: return "Inconnu";
        }
    }
}