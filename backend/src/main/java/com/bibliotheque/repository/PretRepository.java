package com.bibliotheque.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Pret;

@Repository
public interface PretRepository extends JpaRepository<Pret, Long> {
    @Query("SELECT p FROM Pret p WHERE p.profil.profilId = :profilId AND p.pretStatus.rendu = false")
    List<Pret> findPretsActifsByProfil(@Param("profilId") Long profilId);
    
    @Query("SELECT p FROM Pret p WHERE p.pretStatus.rendu = false")
    List<Pret> findPretsActifs();
    
    @Query("SELECT p FROM Pret p WHERE p.pretStatus.enRetard = true AND p.pretStatus.rendu = false")
    List<Pret> findPretsEnRetard();
    
    @Query("SELECT p FROM Pret p WHERE p.dateFinPret < :date AND p.pretStatus.rendu = false")
    List<Pret> findPretsEchus(@Param("date") LocalDate date);
    
    @Query("SELECT p FROM Pret p WHERE p.dateFinPret BETWEEN :dateDebut AND :dateFin AND p.pretStatus.rendu = false")
    List<Pret> findPretsARendreBientot(@Param("dateDebut") LocalDate dateDebut, @Param("dateFin") LocalDate dateFin);
    
    @Query("SELECT COUNT(p) FROM Pret p WHERE p.profil.profilId = :profilId AND p.datePret BETWEEN " +
           "(SELECT i.dateDebut FROM Inscription i WHERE i.profil.profilId = :profilId ORDER BY i.dateDebut DESC LIMIT 1) AND " +
           "(SELECT i.dateFin FROM Inscription i WHERE i.profil.profilId = :profilId ORDER BY i.dateDebut DESC LIMIT 1)")
    Long countPretsByProfil(@Param("profilId") Long profilId);

    @Query("SELECT COUNT(pp) FROM ProlongementPret pp WHERE pp.pret.profil.profilId = :profilId AND pp.dateDemande BETWEEN " +
       "(SELECT i.dateDebut FROM Inscription i WHERE i.profil.profilId = :profilId ORDER BY i.dateDebut DESC LIMIT 1) AND " +
       "(SELECT i.dateFin FROM Inscription i WHERE i.profil.profilId = :profilId ORDER BY i.dateDebut DESC LIMIT 1)")
    Long countProlongementsByProfil(@Param("profilId") Long profilId);
}