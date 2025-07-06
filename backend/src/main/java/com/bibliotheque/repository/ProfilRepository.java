package com.bibliotheque.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Profil;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {
    Optional<Profil> findByEmail(String email);
    
    @Query("SELECT p FROM Profil p WHERE p.adherant.type.type = :type")
    List<Profil> findByAdherantType(@Param("type") String type);
    
    @Query("SELECT p FROM Profil p WHERE p.nom LIKE %:nom% OR p.prenom LIKE %:prenom%")
    List<Profil> findByNomOrPrenom(@Param("nom") String nom, @Param("prenom") String prenom);
    
    boolean existsByEmail(String email);
    
    // Méthodes pour les statistiques détaillées
    @Query("SELECT COUNT(p) FROM Profil p WHERE p.dateInscription BETWEEN :startDate AND :endDate")
    Long countByDateInscriptionBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT a.type.type, COUNT(p) FROM Profil p JOIN p.adherant a GROUP BY a.type.type ORDER BY COUNT(p) DESC")
    List<Object[]> findUserDistributionByType();
}