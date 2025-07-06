package com.bibliotheque.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bibliotheque.entities.Notification;
import com.bibliotheque.entities.Profil;
import com.bibliotheque.services.NotificationService;
import com.bibliotheque.services.PretService;
import com.bibliotheque.services.ProfilService;

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
    public ResponseEntity<List<Map<String, Object>>> getAllNotifications() {
        try {
            List<Notification> notifications = notificationService.getAllNotifications();
            List<Map<String, Object>> response = notifications.stream()
                    .map(this::convertNotificationToResponse)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(List.of(error));
        }
    }
    
    @GetMapping("/notifications/profil/{profilId}")
    public ResponseEntity<List<Map<String, Object>>> getNotificationsByProfil(@PathVariable Long profilId) {
        List<Notification> notifications = notificationService.getNotificationsByProfil(profilId);
        List<Map<String, Object>> response = notifications.stream()
                .map(this::convertNotificationToResponse)
                .toList();
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/notifications/{notificationId}/lue")
    public ResponseEntity<?> marquerNotificationLue(@PathVariable Long notificationId) {
        try {
            notificationService.marquerCommeLue(notificationId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification marquée comme lue");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/notifications/profil/{profilId}/toutes-lues")
    public ResponseEntity<?> marquerToutesNotificationsLues(@PathVariable Long profilId) {
        try {
            notificationService.marquerToutesCommeLues(profilId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Toutes les notifications ont été marquées comme lues");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
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
    
    private Map<String, Object> convertNotificationToResponse(Notification notification) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", notification.getNotificationId());
        response.put("message", notification.getMessage());
        response.put("dateEnvoi", notification.getDateEnvoi().toString());
        
        // Ajouter les informations du profil
        if (notification.getProfil() != null) {
            Map<String, Object> profil = new HashMap<>();
            profil.put("id", notification.getProfil().getProfilId());
            profil.put("nom", notification.getProfil().getNom());
            profil.put("prenom", notification.getProfil().getPrenom());
            profil.put("email", notification.getProfil().getEmail());
            response.put("profil", profil);
        }
        
        // Convertir le type de notification
        String type = "Information";
        if (notification.getNotificationType() != null) {
            switch (notification.getNotificationType().getType()) {
                case 0: type = "Rappel"; break;
                case 1: type = "Penalite"; break;
                case 2: type = "Disponibilite"; break;
                default: type = "Information"; break;
            }
        }
        response.put("type", type);
        
        // Convertir le statut de notification
        String statut = "Non lu";
        if (notification.getNotificationStatus() != null) {
            statut = notification.getNotificationStatus().getStatut() == 0 ? "Non lu" : "Lu";
        }
        response.put("statut", statut);
        
        return response;
    }
} 