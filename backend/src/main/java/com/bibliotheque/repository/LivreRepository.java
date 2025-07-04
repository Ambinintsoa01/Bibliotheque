package com.bibliotheque.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Livre;

@Repository
public interface LivreRepository extends JpaRepository<Livre, Long> {
    Optional<Livre> findByIsbn(String isbn);
    
    @Query("SELECT l FROM Livre l WHERE l.titre LIKE %:titre%")
    List<Livre> findByTitreContaining(@Param("titre") String titre);
    
    @Query("SELECT l FROM Livre l JOIN l.auteurs a WHERE a.nom LIKE %:nom% OR a.prenom LIKE %:prenom%")
    List<Livre> findByAuteurNomOrPrenom(@Param("nom") String nom, @Param("prenom") String prenom);
    
    @Query("SELECT l FROM Livre l JOIN l.categories c WHERE c.nom = :categorie")
    List<Livre> findByCategorie(@Param("categorie") String categorie);
    
    @Query("SELECT l FROM Livre l WHERE l.titre LIKE %:search% OR l.isbn LIKE %:search% OR EXISTS (SELECT a FROM l.auteurs a WHERE a.nom LIKE %:search% OR a.prenom LIKE %:search%)")
    List<Livre> searchLivres(@Param("search") String search);
    
    @Query("SELECT l FROM Livre l JOIN l.exemplaires e WHERE e.exemplaireEtat.etat < 4")
    List<Livre> findLivresDisponibles();
}