package com.bibliotheque.entities;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "tarif_inscription")
public class TarifInscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tarif_id")
    private Long tarifId;

    @Column(name = "description")
    private String description;

    @Column(name = "montant", nullable = false)
    private BigDecimal montant;

    @Column(name = "nb_mois", nullable = false)
    private int nbMois;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_adherant_id", nullable = false)
    @JsonIgnore
    private AdherantType typeAdherant;

    // Getters et setters
    public Long getTarifId() { return tarifId; }
    public void setTarifId(Long tarifId) { this.tarifId = tarifId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }
    public int getNbMois() { return nbMois; }
    public void setNbMois(int nbMois) { this.nbMois = nbMois; }
    public AdherantType getTypeAdherant() { return typeAdherant; }
    public void setTypeAdherant(AdherantType typeAdherant) { this.typeAdherant = typeAdherant; }
} 