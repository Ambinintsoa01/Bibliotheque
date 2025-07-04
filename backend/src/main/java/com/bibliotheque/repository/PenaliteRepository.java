package com.bibliotheque.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Penalite;

@Repository
public interface PenaliteRepository extends JpaRepository<Penalite, Long> {
    @Query("SELECT p FROM Penalite p WHERE p.profil.profilId = :profilId AND p.penaliteStatus.statut = 0")
    List<Penalite> findPenalitesActivesByProfil(@Param("profilId") Long profilId);
    
    @Query("SELECT p FROM Penalite p WHERE p.penaliteStatus.statut = 0")
    List<Penalite> findPenalitesActives();
    
    @Query("SELECT SUM(p.montant) FROM Penalite p WHERE p.profil.profilId = :profilId AND p.penaliteStatus.statut = 0")
    BigDecimal getTotalPenalitesActivesByProfil(@Param("profilId") Long profilId);
    
    @Query("SELECT SUM(p.montant) FROM Penalite p WHERE p.penaliteStatus.statut = 1")
    BigDecimal getTotalPenalitesPayees();
    
    @Query("SELECT SUM(p.montant) FROM Penalite p WHERE p.penaliteStatus.statut = 0")
    BigDecimal getTotalPenalitesActives();
    
    @Query("SELECT p FROM Penalite p JOIN p.penaliteStatus ps WHERE p.profil.profilId = :profilId AND ps.statut = 0 AND :date BETWEEN p.dateDebut AND p.dateFin")
    List<Penalite> findPenalitesActivesByProfilAndDate(@Param("profilId") Long profilId, @Param("date") java.time.LocalDate date);
}