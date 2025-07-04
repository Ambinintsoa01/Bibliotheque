package com.bibliotheque.repository;

import com.bibliotheque.entities.AdherantType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdherantTypeRepository extends JpaRepository<AdherantType, Long> {
    Optional<AdherantType> findByType(String type);
}