package com.bibliotheque.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bibliotheque.entities.Settings;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
    Settings findTopByOrderByIdDesc();
} 