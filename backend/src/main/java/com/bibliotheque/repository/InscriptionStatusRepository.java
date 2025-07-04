package com.bibliotheque.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.InscriptionStatus;

@Repository
public interface InscriptionStatusRepository extends JpaRepository<InscriptionStatus, Long> {
} 