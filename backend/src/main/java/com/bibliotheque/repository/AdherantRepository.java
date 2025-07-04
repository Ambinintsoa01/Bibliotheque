package com.bibliotheque.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bibliotheque.entities.Adherant;

public interface AdherantRepository extends JpaRepository<Adherant, Long> {
}