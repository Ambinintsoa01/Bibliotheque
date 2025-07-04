package com.bibliotheque.services;

import com.bibliotheque.entities.Adherant;
import com.bibliotheque.entities.AdherantType;
import com.bibliotheque.entities.Profil;
import com.bibliotheque.repository.AdherantTypeRepository;
import com.bibliotheque.repository.ProfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProfilService {
    
    @Autowired
    private ProfilRepository profilRepository;
    
    @Autowired
    private AdherantTypeRepository adherantTypeRepository;
    
    public List<Profil> getAllProfils() {
        return profilRepository.findAll();
    }
    
    public Optional<Profil> getProfilById(Long id) {
        return profilRepository.findById(id);
    }
    
    public Optional<Profil> getProfilByEmail(String email) {
        return profilRepository.findByEmail(email);
    }
    
    public List<Profil> getProfilsByType(String type) {
        return profilRepository.findByAdherantType(type);
    }
    
    public Profil createProfil(String nom, String prenom, String email, String password, String typeAdherant, String telephone) {
        // Vérifier si l'email existe déjà
        if (profilRepository.existsByEmail(email)) {
            throw new RuntimeException("Email déjà utilisé");
        }
        
        // Récupérer ou créer le type d'adhérant
        AdherantType adherantType = adherantTypeRepository.findByType(typeAdherant)
                .orElseGet(() -> {
                    AdherantType newType = new AdherantType(typeAdherant);
                    return adherantTypeRepository.save(newType);
                });
        
        // Créer l'adhérant
        Adherant adherant = new Adherant(adherantType);
        
        // Créer le profil (mot de passe en clair)
        Profil profil = new Profil(nom, prenom, email, password, LocalDate.now());
        profil.setTelephone(telephone);
        profil.setAdherant(adherant);
        adherant.setProfil(profil);
        
        // Sauvegarder le profil (l'adhérant sera sauvegardé automatiquement grâce à CascadeType.ALL)
        return profilRepository.save(profil);
    }
    
    public Profil updateProfil(Long id, String nom, String prenom, String telephone) {
        Profil profil = profilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
        
        profil.setNom(nom);
        profil.setPrenom(prenom);
        profil.setTelephone(telephone);
        
        return profilRepository.save(profil);
    }
    
    public void deleteProfil(Long id) {
        profilRepository.deleteById(id);
    }
    
    public List<Profil> searchProfils(String search) {
        return profilRepository.findByNomOrPrenom(search, search);
    }
}