package com.bibliotheque.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.TarifInscription;

@Repository
public interface TarifInscriptionRepository extends JpaRepository<TarifInscription, Long> {
} 