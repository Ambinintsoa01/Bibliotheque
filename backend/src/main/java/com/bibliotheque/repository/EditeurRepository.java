package com.bibliotheque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Editeur;

@Repository
public interface EditeurRepository extends JpaRepository<Editeur, Long> {
    Optional<Editeur> findByNom(String nom);
}