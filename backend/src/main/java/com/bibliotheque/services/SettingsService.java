package com.bibliotheque.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bibliotheque.entities.Settings;
import com.bibliotheque.repository.SettingsRepository;

@Service
public class SettingsService {
    @Autowired
    private SettingsRepository settingsRepository;

    public Settings getCurrentSettings() {
        return settingsRepository.findTopByOrderByIdDesc();
    }

    public Settings saveSettings(Settings settings) {
        return settingsRepository.save(settings);
    }
} 