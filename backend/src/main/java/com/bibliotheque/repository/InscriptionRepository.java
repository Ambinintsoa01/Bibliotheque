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
} 