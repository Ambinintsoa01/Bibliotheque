package com.bibliotheque.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Inscription;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    
    @Query("SELECT i.dateFin FROM Inscription i WHERE i.profil.profilId = :profilId ORDER BY i.dateDebut DESC LIMIT 1")
    Optional<LocalDate> findDateFinDerniereInscriptionByProfil(@Param("profilId") Long profilId);
    
    // Méthode pour compter les utilisateurs avec des inscriptions actives
    @Query("SELECT COUNT(DISTINCT i.profil.profilId) FROM Inscription i " +
           "WHERE i.dateFin >= :dateActuelle " +
           "AND i.dateDebut = (" +
           "  SELECT MAX(i2.dateDebut) FROM Inscription i2 WHERE i2.profil.profilId = i.profil.profilId" +
           ")")
    Long countUtilisateursAvecInscriptionActive(@Param("dateActuelle") LocalDate dateActuelle);
} 