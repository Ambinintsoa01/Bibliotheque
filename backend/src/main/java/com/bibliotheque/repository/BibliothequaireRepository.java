package com.bibliotheque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Bibliothequaire;

@Repository
public interface BibliothequaireRepository extends JpaRepository<Bibliothequaire, Long> {
    Optional<Bibliothequaire> findByEmail(String email);
    boolean existsByEmail(String email);
}