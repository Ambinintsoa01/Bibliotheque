package com.bibliotheque.controllers;

import com.bibliotheque.entities.Settings;
import com.bibliotheque.services.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class SettingsController {
    @Autowired
    private SettingsService settingsService;

    @GetMapping
    public Settings getSettings() {
        return settingsService.getCurrentSettings();
    }

    @PostMapping
    public Settings saveSettings(@RequestBody Settings settings) {
        return settingsService.saveSettings(settings);
    }
} 