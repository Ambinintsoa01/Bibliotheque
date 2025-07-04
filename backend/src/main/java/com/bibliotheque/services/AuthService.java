package com.bibliotheque.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bibliotheque.entities.Bibliothequaire;
import com.bibliotheque.entities.Profil;
import com.bibliotheque.repository.BibliothequaireRepository;
import com.bibliotheque.repository.ProfilRepository;

@Service
public class AuthService {
    
    @Autowired
    private ProfilRepository profilRepository;
    
    @Autowired
    private BibliothequaireRepository bibliothequaireRepository;
    
    public Optional<Profil> authenticateClient(String email, String password) {
        return profilRepository.findByEmail(email)
                .filter(profil -> profil.getPwd().equals(password));
    }
    
    public Optional<Bibliothequaire> authenticateAdmin(String email, String password) {
        return bibliothequaireRepository.findByEmail(email)
                .filter(admin -> admin.getPwd().equals(password));
    }
    
    public boolean isEmailTaken(String email) {
        return profilRepository.existsByEmail(email) || bibliothequaireRepository.existsByEmail(email);
    }
}