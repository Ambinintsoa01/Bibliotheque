package com.bibliotheque.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Exemplaire;

@Repository
public interface ExemplaireRepository extends JpaRepository<Exemplaire, Long> {
    List<Exemplaire> findByLivreLivreId(Long livreId);
    
    @Query("SELECT e FROM Exemplaire e WHERE e.livre.livreId = :livreId AND e.exemplaireEtat.etat < 4 AND NOT EXISTS (SELECT p FROM Pret p WHERE p.exemplaire = e AND p.pretStatus.rendu = false)")
    List<Exemplaire> findExemplairesDisponibles(@Param("livreId") Long livreId);
    
    @Query("SELECT e FROM Exemplaire e WHERE e.exemplaireEtat.etat < 4")
    List<Exemplaire> findExemplairesEnBonEtat();
    
    @Query("SELECT e FROM Exemplaire e WHERE EXISTS (SELECT p FROM Pret p WHERE p.exemplaire = e AND p.pretStatus.rendu = false)")
    List<Exemplaire> findExemplairesEmpruntes();
}