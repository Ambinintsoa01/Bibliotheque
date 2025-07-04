package com.bibliotheque.entities;

import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;
    
    @ManyToOne
    @JoinColumn(name = "exemplaire_id", nullable = false)
    private Exemplaire exemplaire;
    
    @ManyToOne
    @JoinColumn(name = "profil_id", nullable = false)
    private Profil profil;
    
    @Column(name = "date_resa", nullable = false)
    private LocalDate dateResa;
    
    @Column(name = "date_expiration", nullable = false)
    private LocalDate dateExpiration;
    
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL)
    private ReservationStatus reservationStatus;
    
    // Constructors
    public Reservation() {}
    
    public Reservation(Exemplaire exemplaire, Profil profil, LocalDate dateResa, LocalDate dateExpiration) {
        this.exemplaire = exemplaire;
        this.profil = profil;
        this.dateResa = dateResa;
        this.dateExpiration = dateExpiration;
    }
    
    // Getters and Setters
    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }
    
    public Exemplaire getExemplaire() { return exemplaire; }
    public void setExemplaire(Exemplaire exemplaire) { this.exemplaire = exemplaire; }
    
    public Profil getProfil() { return profil; }
    public void setProfil(Profil profil) { this.profil = profil; }
    
    public LocalDate getDateResa() { return dateResa; }
    public void setDateResa(LocalDate dateResa) { this.dateResa = dateResa; }
    
    public LocalDate getDateExpiration() { return dateExpiration; }
    public void setDateExpiration(LocalDate dateExpiration) { this.dateExpiration = dateExpiration; }
    
    public ReservationStatus getReservationStatus() { return reservationStatus; }
    public void setReservationStatus(ReservationStatus reservationStatus) { this.reservationStatus = reservationStatus; }
}