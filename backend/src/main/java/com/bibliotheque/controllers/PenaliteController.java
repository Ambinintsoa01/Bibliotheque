package com.bibliotheque.controllers;

import com.bibliotheque.entities.Penalite;
import com.bibliotheque.repository.PenaliteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/penalites")
@CrossOrigin(origins = "http://localhost:5173")
public class PenaliteController {
    
    @Autowired
    private PenaliteRepository penaliteRepository;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPenalites() {
        try {
            List<Penalite> penalites = penaliteRepository.findAll();
            List<Map<String, Object>> penalitesDTO = penalites.stream().map(penalite -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", penalite.getPenaliteId());
                dto.put("dateDebut", penalite.getDateDebut() != null ? penalite.getDateDebut().toString() : null);
                dto.put("dateFin", penalite.getDateFin() != null ? penalite.getDateFin().toString() : null);
                dto.put("montant", penalite.getMontant() != null ? penalite.getMontant().doubleValue() : 0.0);
                dto.put("raisons", penalite.getRaisons());
                
                // Gérer le cas où PenaliteStatus est null
                String statut = "Active"; // Par défaut
                if (penalite.getPenaliteStatus() != null) {
                    statut = penalite.getPenaliteStatus().getStatutString();
                }
                dto.put("statut", statut);
                
                Map<String, Object> profilDTO = new HashMap<>();
                if (penalite.getProfil() != null) {
                    profilDTO.put("profilId", penalite.getProfil().getProfilId());
                    profilDTO.put("nom", penalite.getProfil().getNom());
                    profilDTO.put("prenom", penalite.getProfil().getPrenom());
                    profilDTO.put("email", penalite.getProfil().getEmail());
                } else {
                    profilDTO.put("profilId", 0);
                    profilDTO.put("nom", "Inconnu");
                    profilDTO.put("prenom", "");
                    profilDTO.put("email", "");
                }
                dto.put("profil", profilDTO);
                
                return dto;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(penalitesDTO);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(List.of(error));
        }
    }
    
    @GetMapping("/actives")
    public ResponseEntity<List<Map<String, Object>>> getPenalitesActives() {
        try {
            List<Penalite> penalites = penaliteRepository.findPenalitesActives();
            List<Map<String, Object>> penalitesDTO = penalites.stream().map(penalite -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", penalite.getPenaliteId());
                dto.put("dateDebut", penalite.getDateDebut() != null ? penalite.getDateDebut().toString() : null);
                dto.put("dateFin", penalite.getDateFin() != null ? penalite.getDateFin().toString() : null);
                dto.put("montant", penalite.getMontant() != null ? penalite.getMontant().doubleValue() : 0.0);
                dto.put("raisons", penalite.getRaisons());
                
                // Gérer le cas où PenaliteStatus est null
                String statut = "Active"; // Par défaut
                if (penalite.getPenaliteStatus() != null) {
                    statut = penalite.getPenaliteStatus().getStatutString();
                }
                dto.put("statut", statut);
                
                Map<String, Object> profilDTO = new HashMap<>();
                if (penalite.getProfil() != null) {
                    profilDTO.put("profilId", penalite.getProfil().getProfilId());
                    profilDTO.put("nom", penalite.getProfil().getNom());
                    profilDTO.put("prenom", penalite.getProfil().getPrenom());
                    profilDTO.put("email", penalite.getProfil().getEmail());
                } else {
                    profilDTO.put("profilId", 0);
                    profilDTO.put("nom", "Inconnu");
                    profilDTO.put("prenom", "");
                    profilDTO.put("email", "");
                }
                dto.put("profil", profilDTO);
                
                return dto;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(penalitesDTO);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(List.of(error));
        }
    }
    
    @GetMapping("/total-actives")
    public ResponseEntity<BigDecimal> getTotalPenalitesActives() {
        BigDecimal total = penaliteRepository.getTotalPenalitesActives();
        return ResponseEntity.ok(total != null ? total : BigDecimal.ZERO);
    }
    
    @GetMapping("/total-payees")
    public ResponseEntity<BigDecimal> getTotalPenalitesPayees() {
        BigDecimal total = penaliteRepository.getTotalPenalitesPayees();
        return ResponseEntity.ok(total != null ? total : BigDecimal.ZERO);
    }
    
    @PutMapping("/{id}/payer")
    public ResponseEntity<?> marquerPenalitePayee(@PathVariable Long id) {
        try {
            Penalite penalite = penaliteRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pénalité non trouvée"));
            
            if (penalite.getPenaliteStatus() == null) {
                throw new RuntimeException("Statut de pénalité non trouvé");
            }
            
            penalite.getPenaliteStatus().setStatut(1); // 1 = Payée
            penaliteRepository.save(penalite);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Pénalité marquée comme payée");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}/annuler")
    public ResponseEntity<?> annulerPenalite(@PathVariable Long id) {
        try {
            Penalite penalite = penaliteRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Pénalité non trouvée"));
            
            if (penalite.getPenaliteStatus() == null) {
                throw new RuntimeException("Statut de pénalité non trouvé");
            }
            
            penalite.getPenaliteStatus().setStatut(2); // 2 = Annulée
            penaliteRepository.save(penalite);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Pénalité annulée");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 