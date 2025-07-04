package com.bibliotheque.controllers;

import com.bibliotheque.entities.Bibliothequaire;
import com.bibliotheque.entities.Profil;
import com.bibliotheque.services.AuthService;
import com.bibliotheque.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        String role = loginRequest.get("role");
        
        Map<String, Object> response = new HashMap<>();
        
        if ("admin".equals(role)) {
            Optional<Bibliothequaire> bibliothequaire = authService.authenticateAdmin(email, password);
            if (bibliothequaire.isPresent()) {
                String token = jwtUtil.generateToken(email, "admin");
                response.put("success", true);
                response.put("token", token);
                response.put("user", createUserResponse(bibliothequaire.get()));
                return ResponseEntity.ok(response);
            }
        } else if ("client".equals(role)) {
            Optional<Profil> profil = authService.authenticateClient(email, password);
            if (profil.isPresent()) {
                String token = jwtUtil.generateToken(email, "client");
                response.put("success", true);
                response.put("token", token);
                response.put("user", createUserResponse(profil.get()));
                return ResponseEntity.ok(response);
            }
        }
        
        response.put("success", false);
        response.put("error", "Identifiants invalides");
        return ResponseEntity.badRequest().body(response);
    }
    
    private Map<String, Object> createUserResponse(Bibliothequaire bibliothequaire) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", bibliothequaire.getBibliothequaireId());
        user.put("email", bibliothequaire.getEmail());
        user.put("nom", bibliothequaire.getNom());
        user.put("prenom", "Bibliothèque");
        user.put("role", "admin");
        user.put("dateInscription", "2023-01-01");
        return user;
    }
    
    private Map<String, Object> createUserResponse(Profil profil) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", profil.getProfilId());
        user.put("email", profil.getEmail());
        user.put("nom", profil.getNom());
        user.put("prenom", profil.getPrenom());
        user.put("role", "client");
        user.put("telephone", profil.getTelephone());
        user.put("dateInscription", profil.getDateInscription().toString());
        user.put("adherantType", profil.getAdherant().getType().getType());
        return user;
    }
}