package com.bibliotheque.controllers;

import com.bibliotheque.entities.Livre;
import com.bibliotheque.entities.Exemplaire;
import com.bibliotheque.services.LivreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/livres")
@CrossOrigin(origins = "http://localhost:5173")
public class LivreController {
    
    @Autowired
    private LivreService livreService;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllLivres() {
        List<Livre> livres = livreService.getAllLivres();
        List<Map<String, Object>> response = livres.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getLivreById(@PathVariable Long id) {
        return livreService.getLivreById(id)
                .map(livre -> ResponseEntity.ok(convertToResponse(livre)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchLivres(@RequestParam String q) {
        List<Livre> livres = livreService.searchLivres(q);
        List<Map<String, Object>> response = livres.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/disponibles")
    public ResponseEntity<List<Map<String, Object>>> getLivresDisponibles() {
        List<Livre> livres = livreService.getLivresDisponibles();
        List<Map<String, Object>> response = livres.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createLivre(@RequestBody Map<String, Object> livreData) {
        try {
            String titre = (String) livreData.get("titre");
            String isbn = (String) livreData.get("isbn");
            String edition = (String) livreData.get("edition");
            String description = (String) livreData.get("description");
            String imageCouverture = (String) livreData.get("imageCouverture");
            
            LocalDate datePublication = null;
            if (livreData.get("datePublication") != null) {
                datePublication = LocalDate.parse((String) livreData.get("datePublication"));
            }
            
            Livre livre = livreService.createLivre(titre, isbn, edition, description, datePublication, imageCouverture);
            return ResponseEntity.ok(convertToResponse(livre));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateLivre(@PathVariable Long id, @RequestBody Map<String, Object> livreData) {
        try {
            String titre = (String) livreData.get("titre");
            String edition = (String) livreData.get("edition");
            String description = (String) livreData.get("description");
            String imageCouverture = (String) livreData.get("imageCouverture");
            
            LocalDate datePublication = null;
            if (livreData.get("datePublication") != null) {
                datePublication = LocalDate.parse((String) livreData.get("datePublication"));
            }
            
            Livre livre = livreService.updateLivre(id, titre, edition, description, datePublication, imageCouverture);
            return ResponseEntity.ok(convertToResponse(livre));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivre(@PathVariable Long id) {
        try {
            livreService.deleteLivre(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/exemplaires")
    public ResponseEntity<Map<String, Object>> addExemplaire(@PathVariable Long id, @RequestBody Map<String, Object> exemplaireData) {
        try {
            String numExemplaire = (String) exemplaireData.get("numExemplaire");
            Integer etat = (Integer) exemplaireData.get("etat");
            Long emplacementId = exemplaireData.get("emplacementId") != null ? 
                    Long.valueOf(exemplaireData.get("emplacementId").toString()) : null;
            
            Exemplaire exemplaire = livreService.addExemplaire(id, numExemplaire, etat, emplacementId);
            return ResponseEntity.ok(convertExemplaireToResponse(exemplaire));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    private Map<String, Object> convertToResponse(Livre livre) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", livre.getLivreId());
        response.put("titre", livre.getTitre());
        response.put("isbn", livre.getIsbn());
        response.put("edition", livre.getEdition());
        response.put("description", livre.getDescription());
        response.put("datePublication", livre.getDatePublication() != null ? livre.getDatePublication().toString() : null);
        response.put("imageCouverture", livre.getImageCouverture());
        
        // Auteurs
        if (livre.getAuteurs() != null) {
            response.put("auteurs", livre.getAuteurs().stream()
                    .map(auteur -> {
                        Map<String, Object> auteurMap = new HashMap<>();
                        auteurMap.put("id", auteur.getAuteurId());
                        auteurMap.put("nom", auteur.getNom());
                        auteurMap.put("prenom", auteur.getPrenom());
                        return auteurMap;
                    })
                    .collect(Collectors.toList()));
        }
        
        // Catégories
        if (livre.getCategories() != null) {
            response.put("categories", livre.getCategories().stream()
                    .map(categorie -> {
                        Map<String, Object> categorieMap = new HashMap<>();
                        categorieMap.put("id", categorie.getCategorieId());
                        categorieMap.put("nom", categorie.getNom());
                        return categorieMap;
                    })
                    .collect(Collectors.toList()));
        }
        
        // Exemplaires
        if (livre.getExemplaires() != null) {
            response.put("exemplaires", livre.getExemplaires().stream()
                    .map(this::convertExemplaireToResponse)
                    .collect(Collectors.toList()));
        }
        
        return response;
    }
    
    private Map<String, Object> convertExemplaireToResponse(Exemplaire exemplaire) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", exemplaire.getExemplaireId());
        response.put("numExemplaire", exemplaire.getNumExemplaire());
        
        if (exemplaire.getExemplaireEtat() != null) {
            response.put("etat", exemplaire.getExemplaireEtat().getEtatString());
            response.put("dateAcquisition", exemplaire.getExemplaireEtat().getDateAcquisition().toString());
        }
        
        // Vérifier si l'exemplaire est disponible (pas de prêt actif)
        boolean disponible = exemplaire.getPrets() == null || 
                exemplaire.getPrets().stream()
                        .noneMatch(pret -> pret.getPretStatus() != null && !pret.getPretStatus().getRendu());
        response.put("disponible", disponible);
        
        return response;
    }
}