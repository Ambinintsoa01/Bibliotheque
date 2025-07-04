package com.bibliotheque.services;

import com.bibliotheque.entities.*;
import com.bibliotheque.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LivreService {
    
    @Autowired
    private LivreRepository livreRepository;
    
    @Autowired
    private ExemplaireRepository exemplaireRepository;
    
    @Autowired
    private AuteurRepository auteurRepository;
    
    @Autowired
    private CategorieRepository categorieRepository;
    
    @Autowired
    private EditeurRepository editeurRepository;
    
    public List<Livre> getAllLivres() {
        return livreRepository.findAll();
    }
    
    public Optional<Livre> getLivreById(Long id) {
        return livreRepository.findById(id);
    }
    
    public List<Livre> searchLivres(String search) {
        return livreRepository.searchLivres(search);
    }
    
    public List<Livre> getLivresByCategorie(String categorie) {
        return livreRepository.findByCategorie(categorie);
    }
    
    public List<Livre> getLivresDisponibles() {
        return livreRepository.findLivresDisponibles();
    }
    
    public Livre createLivre(String titre, String isbn, String edition, String description, 
                           LocalDate datePublication, String imageCouverture) {
        Livre livre = new Livre(titre, isbn);
        livre.setEdition(edition);
        livre.setDescription(description);
        livre.setDatePublication(datePublication);
        livre.setImageCouverture(imageCouverture);
        
        return livreRepository.save(livre);
    }
    
    public Livre updateLivre(Long id, String titre, String edition, String description, 
                           LocalDate datePublication, String imageCouverture) {
        Livre livre = livreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livre non trouvé"));
        
        livre.setTitre(titre);
        livre.setEdition(edition);
        livre.setDescription(description);
        livre.setDatePublication(datePublication);
        livre.setImageCouverture(imageCouverture);
        
        return livreRepository.save(livre);
    }
    
    public void deleteLivre(Long id) {
        livreRepository.deleteById(id);
    }
    
    public Exemplaire addExemplaire(Long livreId, String numExemplaire, Integer etat, Long emplacementId) {
        Livre livre = livreRepository.findById(livreId)
                .orElseThrow(() -> new RuntimeException("Livre non trouvé"));
        
        Exemplaire exemplaire = new Exemplaire(livre, numExemplaire);
        
        if (emplacementId != null) {
            // Récupérer l'emplacement si fourni
            // exemplaire.setEmplacement(emplacementRepository.findById(emplacementId).orElse(null));
        }
        
        exemplaire = exemplaireRepository.save(exemplaire);
        
        // Créer l'état de l'exemplaire
        ExemplaireEtat exemplaireEtat = new ExemplaireEtat(exemplaire, etat, LocalDate.now());
        exemplaire.setExemplaireEtat(exemplaireEtat);
        
        return exemplaireRepository.save(exemplaire);
    }
    
    public List<Exemplaire> getExemplairesDisponibles(Long livreId) {
        return exemplaireRepository.findExemplairesDisponibles(livreId);
    }
    
    public boolean isLivreDisponible(Long livreId) {
        return !getExemplairesDisponibles(livreId).isEmpty();
    }
}