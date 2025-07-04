package com.bibliotheque.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "livre")
public class Livre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "livre_id")
    private Long livreId;
    
    @NotBlank
    @Column(length = 100, nullable = false)
    private String titre;
    
    @Column(length = 20, nullable = false, unique = true)
    private String isbn;
    
    @Column(length = 50)
    private String edition;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "date_publication")
    private LocalDate datePublication;
    
    @Column(name = "image_couverture", length = 255)
    private String imageCouverture;
    
    @OneToMany(mappedBy = "livre", cascade = CascadeType.ALL)
    private List<Exemplaire> exemplaires;
    
    @ManyToMany
    @JoinTable(
        name = "livre_auteur",
        joinColumns = @JoinColumn(name = "livre_id"),
        inverseJoinColumns = @JoinColumn(name = "auteur_id")
    )
    private List<Auteur> auteurs;
    
    @ManyToMany
    @JoinTable(
        name = "livre_categorie",
        joinColumns = @JoinColumn(name = "livre_id"),
        inverseJoinColumns = @JoinColumn(name = "categorie_id")
    )
    private List<Categorie> categories;
    
    @ManyToOne
    @JoinColumn(name = "editeur_id")
    private Editeur editeur;
    
    // Constructors
    public Livre() {}
    
    public Livre(String titre, String isbn) {
        this.titre = titre;
        this.isbn = isbn;
    }
    
    // Getters and Setters
    public Long getLivreId() { return livreId; }
    public void setLivreId(Long livreId) { this.livreId = livreId; }
    
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    
    public String getEdition() { return edition; }
    public void setEdition(String edition) { this.edition = edition; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDate getDatePublication() { return datePublication; }
    public void setDatePublication(LocalDate datePublication) { this.datePublication = datePublication; }
    
    public String getImageCouverture() { return imageCouverture; }
    public void setImageCouverture(String imageCouverture) { this.imageCouverture = imageCouverture; }
    
    public List<Exemplaire> getExemplaires() { return exemplaires; }
    public void setExemplaires(List<Exemplaire> exemplaires) { this.exemplaires = exemplaires; }
    
    public List<Auteur> getAuteurs() { return auteurs; }
    public void setAuteurs(List<Auteur> auteurs) { this.auteurs = auteurs; }
    
    public List<Categorie> getCategories() { return categories; }
    public void setCategories(List<Categorie> categories) { this.categories = categories; }
    
    public Editeur getEditeur() { return editeur; }
    public void setEditeur(Editeur editeur) { this.editeur = editeur; }
}