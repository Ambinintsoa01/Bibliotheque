package com.bibliotheque.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Auteur;

@Repository
public interface AuteurRepository extends JpaRepository<Auteur, Long> {
    @Query("SELECT a FROM Auteur a WHERE a.nom LIKE %:nom% OR a.prenom LIKE %:prenom%")
    List<Auteur> findByNomOrPrenom(@Param("nom") String nom, @Param("prenom") String prenom);
    
    List<Auteur> findByNationalite(String nationalite);
}