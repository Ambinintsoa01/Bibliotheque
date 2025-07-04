package com.bibliotheque.controllers;

import com.bibliotheque.entities.Profil;
import com.bibliotheque.entities.Pret;
import com.bibliotheque.entities.Notification;
import com.bibliotheque.services.ProfilService;
import com.bibliotheque.services.PretService;
import com.bibliotheque.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/profils")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfilController {
    
    @Autowired
    private ProfilService profilService;
    
    @Autowired
    private PretService pretService;
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProfils() {
        List<Profil> profils = profilService.getAllProfils();
        List<Map<String, Object>> response = profils.stream()
                .map(this::convertToResponse)
                .toList();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProfilById(@PathVariable Long id) {
        return profilService.getProfilById(id)
                .map(this::convertToResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Map<String, Object>>> getProfilsByType(@PathVariable String type) {
        List<Profil> profils = profilService.getProfilsByType(type);
        List<Map<String, Object>> response = profils.stream()
                .map(this::convertToResponse)
                .toList();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchProfils(@RequestParam String q) {
        List<Profil> profils = profilService.searchProfils(q);
        List<Map<String, Object>> response = profils.stream()
                .map(this::convertToResponse)
                .toList();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<?> createProfil(@RequestBody Map<String, String> profilData) {
        try {
            String nom = profilData.get("nom");
            String prenom = profilData.get("prenom");
            String email = profilData.get("email");
            String password = profilData.get("password");
            String typeAdherant = profilData.get("adherantType");
            String telephone = profilData.get("telephone");
            
            Profil profil = profilService.createProfil(nom, prenom, email, password, typeAdherant, telephone);
            return ResponseEntity.ok(convertToResponse(profil));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfil(@PathVariable Long id, @RequestBody Map<String, String> profilData) {
        try {
            String nom = profilData.get("nom");
            String prenom = profilData.get("prenom");
            String telephone = profilData.get("telephone");
            
            Profil profil = profilService.updateProfil(id, nom, prenom, telephone);
            return ResponseEntity.ok(convertToResponse(profil));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfil(@PathVariable Long id) {
        try {
            profilService.deleteProfil(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/notifications/all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }
    
    @GetMapping("/notifications/profil/{profilId}")
    public ResponseEntity<List<Notification>> getNotificationsByProfil(@PathVariable Long profilId) {
        return ResponseEntity.ok(notificationService.getNotificationsByProfil(profilId));
    }
    
    private Map<String, Object> convertToResponse(Profil profil) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", profil.getProfilId());
        response.put("nom", profil.getNom());
        response.put("prenom", profil.getPrenom());
        response.put("email", profil.getEmail());
        response.put("telephone", profil.getTelephone());
        response.put("dateInscription", profil.getDateInscription().toString());
        response.put("adherantType", profil.getAdherant().getType().getType());
        response.put("role", "client");
        return response;
    }
} 