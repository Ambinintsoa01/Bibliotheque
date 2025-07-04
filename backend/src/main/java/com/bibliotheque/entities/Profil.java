package com.bibliotheque.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "profil")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Profil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profil_id")
    private Long profilId;
    
    @NotBlank
    @Column(length = 50, nullable = false)
    private String nom;
    
    @NotBlank
    @Column(length = 50, nullable = false)
    private String prenom;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "adherant_id", nullable = false)
    private Adherant adherant;
    
    @NotBlank
    @Column(length = 255, nullable = false)
    private String pwd;
    
    @Email
    @Column(length = 100, nullable = false, unique = true)
    private String email;
    
    @Column(length = 20)
    private String telephone;
    
    @Column(name = "date_inscription", nullable = false)
    private LocalDate dateInscription;
    
    @OneToMany(mappedBy = "profil")
    @JsonIgnore
    private List<Pret> prets;
    
    @OneToMany(mappedBy = "profil", cascade = CascadeType.ALL)
    private List<Reservation> reservations;
    
    @OneToMany(mappedBy = "profil", cascade = CascadeType.ALL)
    private List<Penalite> penalites;
    
    // Constructors
    public Profil() {}
    
    public Profil(String nom, String prenom, String email, String pwd, LocalDate dateInscription) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.pwd = pwd;
        this.dateInscription = dateInscription;
    }
    
    // Getters and Setters
    public Long getProfilId() { return profilId; }
    public void setProfilId(Long profilId) { this.profilId = profilId; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public Adherant getAdherant() { return adherant; }
    public void setAdherant(Adherant adherant) { this.adherant = adherant; }
    
    public String getPwd() { return pwd; }
    public void setPwd(String pwd) { this.pwd = pwd; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    
    public LocalDate getDateInscription() { return dateInscription; }
    public void setDateInscription(LocalDate dateInscription) { this.dateInscription = dateInscription; }
    
    public List<Pret> getPrets() { return prets; }
    public void setPrets(List<Pret> prets) { this.prets = prets; }
    
    public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }
    
    public List<Penalite> getPenalites() { return penalites; }
    public void setPenalites(List<Penalite> penalites) { this.penalites = penalites; }
}