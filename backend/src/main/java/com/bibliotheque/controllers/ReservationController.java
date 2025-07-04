package com.bibliotheque.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import org.springframework.web.bind.annotation.RestController;

import com.bibliotheque.entities.Reservation;
import com.bibliotheque.services.ReservationService;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {
    
    @Autowired
    private ReservationService reservationService;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        List<Map<String, Object>> response = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/en-attente")
    public ResponseEntity<List<Map<String, Object>>> getReservationsEnAttente() {
        List<Reservation> reservations = reservationService.getReservationsEnAttente();
        List<Map<String, Object>> response = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/profil/{profilId}")
    public ResponseEntity<List<Map<String, Object>>> getReservationsByProfil(@PathVariable Long profilId) {
        List<Reservation> reservations = reservationService.getReservationsByProfil(profilId);
        List<Map<String, Object>> response = reservations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createReservation(@RequestBody Map<String, Object> reservationData) {
        try {
            Long livreId = Long.valueOf(reservationData.get("livreId").toString());
            Long profilId = Long.valueOf(reservationData.get("profilId").toString());
            
            Reservation reservation = reservationService.createReservation(livreId, profilId);
            return ResponseEntity.ok(convertToResponse(reservation));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", e.getMessage()); // <-- clé harmonisée
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}/valider")
    public ResponseEntity<Map<String, Object>> validerReservation(@PathVariable Long id) {
        try {
            Reservation reservation = reservationService.validerReservation(id);
            return ResponseEntity.ok(convertToResponse(reservation));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}/rejeter")
    public ResponseEntity<Map<String, Object>> rejeterReservation(@PathVariable Long id) {
        try {
            Reservation reservation = reservationService.rejeterReservation(id);
            return ResponseEntity.ok(convertToResponse(reservation));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> annulerReservation(@PathVariable Long id) {
        try {
            reservationService.annulerReservation(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    private Map<String, Object> convertToResponse(Reservation reservation) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", reservation.getReservationId());
        response.put("dateResa", reservation.getDateResa().toString());
        response.put("dateExpiration", reservation.getDateExpiration().toString());
        
        // Exemplaire
        Map<String, Object> exemplaireMap = new HashMap<>();
        exemplaireMap.put("id", reservation.getExemplaire().getExemplaireId());
        exemplaireMap.put("numExemplaire", reservation.getExemplaire().getNumExemplaire());
        if (reservation.getExemplaire().getExemplaireEtat() != null) {
            exemplaireMap.put("etat", reservation.getExemplaire().getExemplaireEtat().getEtatString());
            exemplaireMap.put("dateAcquisition", reservation.getExemplaire().getExemplaireEtat().getDateAcquisition().toString());
        }
        exemplaireMap.put("disponible", true);
        response.put("exemplaire", exemplaireMap);
        
        // Profil
        Map<String, Object> profilMap = new HashMap<>();
        profilMap.put("id", reservation.getProfil().getProfilId());
        profilMap.put("email", reservation.getProfil().getEmail());
        profilMap.put("nom", reservation.getProfil().getNom());
        profilMap.put("prenom", reservation.getProfil().getPrenom());
        profilMap.put("role", "client");
        profilMap.put("dateInscription", reservation.getProfil().getDateInscription().toString());
        response.put("profil", profilMap);
        
        // Statut
        if (reservation.getReservationStatus() != null) {
            response.put("statut", reservation.getReservationStatus().getStatutString());
        }
        
        return response;
    }
}