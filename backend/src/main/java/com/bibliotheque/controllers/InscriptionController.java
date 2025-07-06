package com.bibliotheque.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bibliotheque.entities.Inscription;
import com.bibliotheque.entities.InscriptionStatus;
import com.bibliotheque.entities.TarifInscription;
import com.bibliotheque.services.InscriptionService;

@RestController
@RequestMapping("/inscriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class InscriptionController {
    @Autowired
    private InscriptionService inscriptionService;

    @PostMapping
    public ResponseEntity<Inscription> addInscription(@RequestBody Inscription inscription) {
        Inscription saved = inscriptionService.addInscription(inscription);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllInscriptions() {
        List<Inscription> inscriptions = inscriptionService.getAllInscriptions();
        System.out.println("Nombre d'inscriptions trouvées: " + inscriptions.size());
        
        List<Map<String, Object>> response = inscriptions.stream().map(inscription -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", inscription.getInscriptionId());
            map.put("dateDebut", inscription.getDateDebut().toString());
            map.put("dateFin", inscription.getDateFin().toString());
            
            // Profil
            Map<String, Object> profilMap = new HashMap<>();
            profilMap.put("id", inscription.getProfil().getProfilId());
            profilMap.put("nom", inscription.getProfil().getNom());
            profilMap.put("prenom", inscription.getProfil().getPrenom());
            profilMap.put("email", inscription.getProfil().getEmail());
            map.put("profil", profilMap);
            
            // Tarif
            Map<String, Object> tarifMap = new HashMap<>();
            tarifMap.put("tarifId", inscription.getTarif().getTarifId());
            tarifMap.put("description", inscription.getTarif().getDescription());
            tarifMap.put("montant", inscription.getTarif().getMontant().doubleValue());
            tarifMap.put("nbMois", inscription.getTarif().getNbMois());
            map.put("tarif", tarifMap);
            
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscription> getInscription(@PathVariable Long id) {
        return inscriptionService.getInscription(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tarifs")
    public ResponseEntity<List<Map<String, Object>>> getAllTarifs() {
        List<TarifInscription> tarifs = inscriptionService.getAllTarifs();
        System.out.println("Nombre de tarifs trouvés: " + tarifs.size());
        
        List<Map<String, Object>> response = tarifs.stream().map(tarif -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tarifId", tarif.getTarifId());
            map.put("description", tarif.getDescription());
            map.put("montant", tarif.getMontant().doubleValue());
            map.put("nbMois", tarif.getNbMois());
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tarifs/{id}")
    public ResponseEntity<TarifInscription> getTarif(@PathVariable Long id) {
        TarifInscription tarif = inscriptionService.getTarif(id);
        if (tarif != null) return ResponseEntity.ok(tarif);
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/status")
    public ResponseEntity<InscriptionStatus> addInscriptionStatus(@RequestBody InscriptionStatus status) {
        InscriptionStatus saved = inscriptionService.addInscriptionStatus(status);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/status")
    public ResponseEntity<List<InscriptionStatus>> getAllInscriptionStatus() {
        return ResponseEntity.ok(inscriptionService.getAllInscriptionStatus());
    }

    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugInscriptions() {
        Map<String, Object> debug = new HashMap<>();
        List<Inscription> inscriptions = inscriptionService.getAllInscriptions();
        List<TarifInscription> tarifs = inscriptionService.getAllTarifs();
        
        debug.put("nombreInscriptions", inscriptions.size());
        debug.put("nombreTarifs", tarifs.size());
        
        // Créer des versions simplifiées pour éviter les problèmes de sérialisation
        List<Map<String, Object>> inscriptionsSimple = inscriptions.stream().map(inscription -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", inscription.getInscriptionId());
            map.put("dateDebut", inscription.getDateDebut().toString());
            map.put("dateFin", inscription.getDateFin().toString());
            map.put("profilId", inscription.getProfil().getProfilId());
            map.put("tarifId", inscription.getTarif().getTarifId());
            return map;
        }).collect(Collectors.toList());
        
        List<Map<String, Object>> tarifsSimple = tarifs.stream().map(tarif -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tarifId", tarif.getTarifId());
            map.put("description", tarif.getDescription());
            map.put("montant", tarif.getMontant().doubleValue());
            map.put("nbMois", tarif.getNbMois());
            return map;
        }).collect(Collectors.toList());
        
        debug.put("inscriptions", inscriptionsSimple);
        debug.put("tarifs", tarifsSimple);
        
        return ResponseEntity.ok(debug);
    }
} 