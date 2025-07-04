package com.bibliotheque.services;

import com.bibliotheque.entities.*;
import com.bibliotheque.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private ExemplaireRepository exemplaireRepository;
    
    @Autowired
    private ProfilRepository profilRepository;
    
    @Autowired
    private LivreService livreService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private SettingsService settingsService;
    
    @Autowired
    private PretRepository pretRepository;
    
    @Autowired
    private PenaliteRepository penaliteRepository;
    
    @Autowired
    private InscriptionRepository inscriptionRepository;
    
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
    
    public List<Reservation> getReservationsEnAttente() {
        return reservationRepository.findReservationsEnAttente();
    }
    
    public List<Reservation> getReservationsByProfil(Long profilId) {
        return reservationRepository.findReservationsActivesByProfil(profilId);
    }
    
    public Reservation createReservation(Long livreId, Long profilId) {
        Profil profil = profilRepository.findById(profilId)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
        
        // Vérifier pénalité active
        List<Penalite> penalitesActives = penaliteRepository.findPenalitesActivesByProfilAndDate(profilId, LocalDate.now());
        if (!penalitesActives.isEmpty()) {
            StringBuilder message = new StringBuilder("Ce client a une pénalité active : ");
            for (Penalite penalite : penalitesActives) {
                message.append(String.format("Pénalité de %.2f€ du %s au %s. ", 
                    penalite.getMontant(), 
                    penalite.getDateDebut(), 
                    penalite.getDateFin()));
            }
            throw new RuntimeException(message.toString());
        }

        // Vérifier le quota dynamique
        Settings settings = settingsService.getCurrentSettings();
        int quotaMax = settings.getQuotaByType(profil.getAdherant().getType().getType());
        Long nbPretsActifs = pretRepository.countPretsByProfil(profilId);
        if (nbPretsActifs >= quotaMax) {
            throw new RuntimeException("Quota de prêts dépassé pour ce profil");
        }

        // Verifier si le profil a une inscription active
        Optional<LocalDate> dateFinInscription = inscriptionRepository.findDateFinDerniereInscriptionByProfil(profilId);
        if (dateFinInscription.isEmpty() || dateFinInscription.get().isBefore(LocalDate.now())) {
            throw new RuntimeException("Le profil n'a pas d'inscription active. Veuillez d'abord vous inscrire.");
        }
        
        // Vérifier si le livre est disponible
        List<Exemplaire> exemplairesDisponibles = livreService.getExemplairesDisponibles(livreId);
        
        if (exemplairesDisponibles.isEmpty()) {
            throw new RuntimeException("Aucun exemplaire disponible pour ce livre");
        }
        
        // Prendre le premier exemplaire disponible
        Exemplaire exemplaire = exemplairesDisponibles.get(0);
        
        LocalDate dateResa = LocalDate.now();
        LocalDate dateExpiration = dateResa.plusDays(3); // 3 jours pour récupérer
        
        Reservation reservation = new Reservation(exemplaire, profil, dateResa, dateExpiration);
        reservation = reservationRepository.save(reservation);
        
        // Créer le statut de réservation
        ReservationStatus reservationStatus = new ReservationStatus(reservation);
        reservation.setReservationStatus(reservationStatus);
        
        return reservationRepository.save(reservation);
    }
    
    public Reservation validerReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        
        reservation.getReservationStatus().setStatut(1); // Disponible
        
        // Envoyer notification de disponibilité
        notificationService.envoyerNotificationDisponibilite(reservation);
        
        return reservationRepository.save(reservation);
    }
    
    public Reservation rejeterReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        
        reservation.getReservationStatus().setStatut(2); // Annulée
        
        return reservationRepository.save(reservation);
    }
    
    public void annulerReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        
        reservation.getReservationStatus().setStatut(2); // Annulée
        reservationRepository.save(reservation);
    }
    
    public void verifierReservationsExpirees() {
        List<Reservation> reservationsExpirees = reservationRepository.findReservationsExpirees(LocalDate.now());
        
        for (Reservation reservation : reservationsExpirees) {
            reservation.getReservationStatus().setStatut(3); // Expirée
            reservationRepository.save(reservation);
        }
    }
    
    public void traiterRetourPourReservations(Long livreId) {
        List<Reservation> reservationsEnAttente = reservationRepository.findReservationsEnAttenteByLivre(livreId);
        
        if (!reservationsEnAttente.isEmpty()) {
            // Valider la première réservation en attente
            Reservation premiereReservation = reservationsEnAttente.get(0);
            validerReservation(premiereReservation.getReservationId());
        }
    }
}