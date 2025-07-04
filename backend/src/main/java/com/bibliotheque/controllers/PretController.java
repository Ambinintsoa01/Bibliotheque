package com.bibliotheque.controllers;

import com.bibliotheque.entities.Pret;
import com.bibliotheque.entities.Penalite;
import com.bibliotheque.services.PretService;
import com.bibliotheque.repository.PenaliteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/prets")
@CrossOrigin(origins = "http://localhost:5173")
public class PretController {

    @Autowired
    private PretService pretService;
    
    @Autowired
    private PenaliteRepository penaliteRepository;

    @GetMapping
    public ResponseEntity<?> getAllPrets() {
        List<Pret> prets = pretService.getAllPrets();
        List<Map<String, Object>> response = prets.stream().map(pret -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", pret.getPretId());
            map.put("datePret", pret.getDatePret().toString());
            map.put("dateFinPret", pret.getDateFinPret().toString());
            map.put("dateRendu", pret.getDateRendu() != null ? pret.getDateRendu().toString() : null);
            map.put("rendu", pret.getDateRendu() != null);
            map.put("enRetard", pret.getPretStatus() != null && pret.getPretStatus().getEnRetard());
            map.put("type", pret.getPretType() != null && pret.getPretType().getType() == 1 ? "sur_place" : "domicile");
            Map<String, Object> profilMap = new HashMap<>();
            profilMap.put("id", pret.getProfil().getProfilId());
            profilMap.put("nom", pret.getProfil().getNom());
            profilMap.put("prenom", pret.getProfil().getPrenom());
            profilMap.put("email", pret.getProfil().getEmail());
            map.put("profil", profilMap);
            Map<String, Object> exemplaireMap = new HashMap<>();
            exemplaireMap.put("id", pret.getExemplaire().getExemplaireId());
            exemplaireMap.put("numExemplaire", pret.getExemplaire().getNumExemplaire());
            map.put("exemplaire", exemplaireMap);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createPret(@RequestBody Map<String, Object> pretData) {
        try {
            Long exemplaireId = Long.valueOf(pretData.get("exemplaireId").toString());
            Long profilId = Long.valueOf(pretData.get("profilId").toString());
            Long bibliothequaireId = Long.valueOf(pretData.get("bibliothequaireId").toString());
            Integer typePret = pretData.get("typePret") != null ? Integer.valueOf(pretData.get("typePret").toString()) : 0;
            Integer dureePret = pretData.get("dureePret") != null ? Integer.valueOf(pretData.get("dureePret").toString()) : 14;

            Pret pret = pretService.createPret(exemplaireId, profilId, bibliothequaireId, typePret, dureePret);
            Map<String, Object> map = new HashMap<>();
            map.put("id", pret.getPretId());
            map.put("datePret", pret.getDatePret().toString());
            map.put("dateFinPret", pret.getDateFinPret().toString());
            map.put("dateRendu", pret.getDateRendu() != null ? pret.getDateRendu().toString() : null);
            map.put("rendu", pret.getDateRendu() != null);
            map.put("enRetard", pret.getPretStatus() != null && pret.getPretStatus().getEnRetard());
            map.put("type", pret.getPretType() != null && pret.getPretType().getType() == 1 ? "sur_place" : "domicile");
            Map<String, Object> profilMap = new HashMap<>();
            profilMap.put("id", pret.getProfil().getProfilId());
            profilMap.put("nom", pret.getProfil().getNom());
            profilMap.put("prenom", pret.getProfil().getPrenom());
            profilMap.put("email", pret.getProfil().getEmail());
            map.put("profil", profilMap);
            Map<String, Object> exemplaireMap = new HashMap<>();
            exemplaireMap.put("id", pret.getExemplaire().getExemplaireId());
            exemplaireMap.put("numExemplaire", pret.getExemplaire().getNumExemplaire());
            map.put("exemplaire", exemplaireMap);
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/retour")
    public ResponseEntity<?> retournerPret(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String dateRenduStr = body.get("dateRendu");
        LocalDate dateRendu = LocalDate.parse(dateRenduStr);
        Pret pret = pretService.retournerPret(id, dateRendu);
        Map<String, Object> map = new HashMap<>();
        map.put("id", pret.getPretId());
        map.put("datePret", pret.getDatePret().toString());
        map.put("dateFinPret", pret.getDateFinPret().toString());
        map.put("dateRendu", pret.getDateRendu() != null ? pret.getDateRendu().toString() : null);
        map.put("rendu", pret.getDateRendu() != null);
        map.put("enRetard", pret.getPretStatus() != null && pret.getPretStatus().getEnRetard());
        map.put("type", pret.getPretType() != null && pret.getPretType().getType() == 1 ? "sur_place" : "domicile");
        Map<String, Object> profilMap = new HashMap<>();
        profilMap.put("id", pret.getProfil().getProfilId());
        profilMap.put("nom", pret.getProfil().getNom());
        profilMap.put("prenom", pret.getProfil().getPrenom());
        profilMap.put("email", pret.getProfil().getEmail());
        map.put("profil", profilMap);
        Map<String, Object> exemplaireMap = new HashMap<>();
        exemplaireMap.put("id", pret.getExemplaire().getExemplaireId());
        exemplaireMap.put("numExemplaire", pret.getExemplaire().getNumExemplaire());
        map.put("exemplaire", exemplaireMap);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/actifs")
    public ResponseEntity<?> getPretsActifs() {
        List<Pret> prets = pretService.getPretsActifs();
        List<Map<String, Object>> response = prets.stream().map(pret -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", pret.getPretId());
            map.put("datePret", pret.getDatePret().toString());
            map.put("dateFinPret", pret.getDateFinPret().toString());
            map.put("dateRendu", pret.getDateRendu() != null ? pret.getDateRendu().toString() : null);
            map.put("rendu", pret.getDateRendu() != null);
            map.put("enRetard", pret.getPretStatus() != null && pret.getPretStatus().getEnRetard());
            map.put("type", pret.getPretType() != null && pret.getPretType().getType() == 1 ? "sur_place" : "domicile");
            Map<String, Object> profilMap = new HashMap<>();
            profilMap.put("id", pret.getProfil().getProfilId());
            profilMap.put("nom", pret.getProfil().getNom());
            profilMap.put("prenom", pret.getProfil().getPrenom());
            profilMap.put("email", pret.getProfil().getEmail());
            map.put("profil", profilMap);
            Map<String, Object> exemplaireMap = new HashMap<>();
            exemplaireMap.put("id", pret.getExemplaire().getExemplaireId());
            exemplaireMap.put("numExemplaire", pret.getExemplaire().getNumExemplaire());
            map.put("exemplaire", exemplaireMap);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/retard")
    public ResponseEntity<?> getPretsEnRetard() {
        List<Pret> prets = pretService.getPretsEnRetard();
        List<Map<String, Object>> response = prets.stream().map(pret -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", pret.getPretId());
            map.put("datePret", pret.getDatePret().toString());
            map.put("dateFinPret", pret.getDateFinPret().toString());
            map.put("dateRendu", pret.getDateRendu() != null ? pret.getDateRendu().toString() : null);
            map.put("rendu", pret.getDateRendu() != null);
            map.put("enRetard", pret.getPretStatus() != null && pret.getPretStatus().getEnRetard());
            map.put("type", pret.getPretType() != null && pret.getPretType().getType() == 1 ? "sur_place" : "domicile");
            Map<String, Object> profilMap = new HashMap<>();
            profilMap.put("id", pret.getProfil().getProfilId());
            profilMap.put("nom", pret.getProfil().getNom());
            profilMap.put("prenom", pret.getProfil().getPrenom());
            profilMap.put("email", pret.getProfil().getEmail());
            map.put("profil", profilMap);
            Map<String, Object> exemplaireMap = new HashMap<>();
            exemplaireMap.put("id", pret.getExemplaire().getExemplaireId());
            exemplaireMap.put("numExemplaire", pret.getExemplaire().getNumExemplaire());
            map.put("exemplaire", exemplaireMap);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verifier-penalites/{profilId}")
    public ResponseEntity<?> verifierPenalitesProfil(@PathVariable Long profilId) {
        try {
            List<Penalite> penalitesActives = penaliteRepository.findPenalitesActivesByProfilAndDate(profilId, LocalDate.now());
            Map<String, Object> response = new HashMap<>();
            
            if (!penalitesActives.isEmpty()) {
                response.put("hasPenalties", true);
                response.put("message", "Ce client a des pénalités actives");
                List<Map<String, Object>> penalitesDTO = penalitesActives.stream().map(penalite -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", penalite.getPenaliteId());
                    dto.put("montant", penalite.getMontant().doubleValue());
                    dto.put("dateDebut", penalite.getDateDebut().toString());
                    dto.put("dateFin", penalite.getDateFin().toString());
                    dto.put("raisons", penalite.getRaisons());
                    return dto;
                }).collect(Collectors.toList());
                response.put("penalites", penalitesDTO);
            } else {
                response.put("hasPenalties", false);
                response.put("message", "Aucune pénalité active");
                response.put("penalites", List.of());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/profil/{profilId}")
    public ResponseEntity<?> getPretsByProfil(@PathVariable Long profilId) {
        List<Pret> prets = pretService.getPretsByProfil(profilId);
        List<Map<String, Object>> response = prets.stream().map(pret -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", pret.getPretId());
            map.put("datePret", pret.getDatePret().toString());
            map.put("dateFinPret", pret.getDateFinPret().toString());
            map.put("dateRendu", pret.getDateRendu() != null ? pret.getDateRendu().toString() : null);
            map.put("rendu", pret.getDateRendu() != null);
            map.put("enRetard", pret.getPretStatus() != null && pret.getPretStatus().getEnRetard());
            map.put("type", pret.getPretType() != null && pret.getPretType().getType() == 1 ? "sur_place" : "domicile");
            Map<String, Object> profilMap = new HashMap<>();
            profilMap.put("id", pret.getProfil().getProfilId());
            profilMap.put("nom", pret.getProfil().getNom());
            profilMap.put("prenom", pret.getProfil().getPrenom());
            profilMap.put("email", pret.getProfil().getEmail());
            map.put("profil", profilMap);
            Map<String, Object> exemplaireMap = new HashMap<>();
            exemplaireMap.put("id", pret.getExemplaire().getExemplaireId());
            exemplaireMap.put("numExemplaire", pret.getExemplaire().getNumExemplaire());
            map.put("exemplaire", exemplaireMap);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{pretId}/prolonger")
    public ResponseEntity<?> prolongerPret(@PathVariable Long pretId, @RequestBody Map<String, Object> body) {
        try {
            Integer nombreJours = body.get("nombreJours") != null ? Integer.valueOf(body.get("nombreJours").toString()) : 14;
            Pret pret = pretService.prolongerPret(pretId, nombreJours);
            Map<String, Object> map = new HashMap<>();
            map.put("id", pret.getPretId());
            map.put("datePret", pret.getDatePret().toString());
            map.put("dateFinPret", pret.getDateFinPret().toString());
            map.put("dateRendu", pret.getDateRendu() != null ? pret.getDateRendu().toString() : null);
            map.put("rendu", pret.getDateRendu() != null);
            map.put("enRetard", pret.getPretStatus() != null && pret.getPretStatus().getEnRetard());
            map.put("type", pret.getPretType() != null && pret.getPretType().getType() == 1 ? "sur_place" : "domicile");
            Map<String, Object> profilMap = new HashMap<>();
            profilMap.put("id", pret.getProfil().getProfilId());
            profilMap.put("nom", pret.getProfil().getNom());
            profilMap.put("prenom", pret.getProfil().getPrenom());
            profilMap.put("email", pret.getProfil().getEmail());
            map.put("profil", profilMap);
            Map<String, Object> exemplaireMap = new HashMap<>();
            exemplaireMap.put("id", pret.getExemplaire().getExemplaireId());
            exemplaireMap.put("numExemplaire", pret.getExemplaire().getNumExemplaire());
            map.put("exemplaire", exemplaireMap);
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 