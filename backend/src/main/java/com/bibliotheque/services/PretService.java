package com.bibliotheque.services;

import com.bibliotheque.entities.*;
import com.bibliotheque.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PretService {
    
    @Autowired
    private PretRepository pretRepository;
    
    @Autowired
    private ExemplaireRepository exemplaireRepository;
    
    @Autowired
    private ProfilRepository profilRepository;
    
    @Autowired
    private BibliothequaireRepository bibliothequaireRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private PenaliteRepository penaliteRepository;
    
    @Autowired
    private ProlongementPretRepository prolongementPretRepository;
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private SettingsService settingsService;

    @Autowired
    private InscriptionRepository inscriptionRepository;
    
    public List<Pret> getAllPrets() {
        return pretRepository.findAll();
    }
    
    public List<Pret> getPretsActifs() {
        return pretRepository.findPretsActifs();
    }
    
    public List<Pret> getPretsEnRetard() {
        return pretRepository.findPretsEnRetard();
    }
    
    public List<Pret> getPretsByProfil(Long profilId) {
        return pretRepository.findPretsActifsByProfil(profilId);
    }
    
    public Pret createPret(Long exemplaireId, Long profilId, Long bibliothequaireId, 
                          Integer typePret, Integer dureePret) {
        Exemplaire exemplaire = exemplaireRepository.findById(exemplaireId)
                .orElseThrow(() -> new RuntimeException("Exemplaire non trouvé"));
        
        Profil profil = profilRepository.findById(profilId)
                .orElseThrow(() -> new RuntimeException("Profil non trouvé"));
        
        Bibliothequaire bibliothequaire = bibliothequaireRepository.findById(bibliothequaireId)
                .orElseThrow(() -> new RuntimeException("Bibliothécaire non trouvé"));
        
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
        
        // Vérifier les quotas
        Settings settings = settingsService.getCurrentSettings();
        int quotaMax = settings.getQuotaByType(profil.getAdherant().getType().getType());
        Long nbPretsActifs = pretRepository.countPretsByProfil(profilId);
        if (nbPretsActifs >= quotaMax) {
            throw new RuntimeException("Quota de prêts dépassé pour ce profil");
        }

        // Vérifier si le profil a une inscription active
        Optional<LocalDate> dateFinInscription = inscriptionRepository.findDateFinDerniereInscriptionByProfil(profilId);
        if (dateFinInscription.isEmpty() || dateFinInscription.get().isBefore(LocalDate.now())) {
            throw new RuntimeException("Le profil n'a pas d'inscription active. Veuillez d'abord vous inscrire.");
        }
        
        LocalDate datePret = LocalDate.now();
        LocalDate dateFinPret = datePret.plusDays(dureePret != null ? dureePret : 14);
        
        Pret pret = new Pret(exemplaire, profil, bibliothequaire, datePret, dateFinPret);
        pret = pretRepository.save(pret);
        
        // Créer le type de prêt
        PretType pretTypeEntity = new PretType(pret, typePret);
        pret.setPretType(pretTypeEntity);
        
        // Créer le statut de prêt
        PretStatus pretStatus = new PretStatus(pret);
        pret.setPretStatus(pretStatus);
        
        return pretRepository.save(pret);
    }
    
    public Pret retournerPret(Long pretId, LocalDate dateRendu) {
        Pret pret = pretRepository.findById(pretId)
                .orElseThrow(() -> new RuntimeException("Prêt non trouvé"));

        pret.setDateRendu(dateRendu);
        pret.getPretStatus().setRendu(true);

        // Mettre à jour la réservation associée si elle existe
        Reservation reservation = reservationRepository.findActiveReservationByExemplaireAndProfil(
            pret.getExemplaire().getExemplaireId(),
            pret.getProfil().getProfilId()
        );
        if (reservation != null && reservation.getReservationStatus().getStatut() < 3) {
            reservation.getReservationStatus().setStatut(3); // Expirée
            reservationRepository.save(reservation);
        }

        // --- LOGIQUE DE PENALITE ---
        Settings settings = settingsService.getCurrentSettings();
        int gracePeriod = settings.getGracePeriod(); // Délai de grâce en jours
        double dailyPenalty = settings.getDailyPenalty(); // Montant pénalité par jour
        double maxPenalty = settings.getMaxPenalty(); // Pénalité max

        LocalDate dateFinPret = pret.getDateFinPret();
        LocalDate dateLimite = dateFinPret.plusDays(gracePeriod);

        if (dateRendu.isAfter(dateLimite)) {
            long daysLate = java.time.temporal.ChronoUnit.DAYS.between(dateLimite, dateRendu);
            double montant = daysLate * dailyPenalty;

            Penalite penalite = new Penalite();
            penalite.setProfil(pret.getProfil());
            penalite.setDateDebut(dateRendu); // Date de début = date_rendu + nombre de jours de retard
            penalite.setDateFin(dateRendu.plusDays(daysLate)); // Pénalité de 30 jours par défaut
            penalite.setMontant(java.math.BigDecimal.valueOf(montant));
            penalite.setRaisons("Retard de rendu du prêt n°" + pret.getPretId() + " - " + daysLate + " jour(s) de retard");
            penalite.setPret(pret);

            penaliteRepository.save(penalite);
        }
        // --- FIN LOGIQUE DE PENALITE ---

        return pretRepository.save(pret);
    }
    
    public void verifierRetards() {
        List<Pret> pretsEchus = pretRepository.findPretsEchus(LocalDate.now());
        
        for (Pret pret : pretsEchus) {
            if (!pret.getPretStatus().getEnRetard()) {
                pret.getPretStatus().setEnRetard(true);
                pretRepository.save(pret);
                
                // Envoyer notification de retard
                notificationService.envoyerNotificationRetard(pret);
            }
        }
    }
    
    public void envoyerRappels() {
        LocalDate dateRappel = LocalDate.now().plusDays(3);
        List<Pret> pretsARendreBientot = pretRepository.findPretsARendreBientot(
                LocalDate.now(), dateRappel);
        
        for (Pret pret : pretsARendreBientot) {
            notificationService.envoyerRappelRetour(pret);
        }
    }
    
    public Pret prolongerPret(Long pretId, Integer nombreJours) {
        Pret pret = pretRepository.findById(pretId)
                .orElseThrow(() -> new RuntimeException("Prêt non trouvé"));

        Long profilId = pret.getProfil().getProfilId();

        // Vérifier que le nombre de jours n'est pas trop élevé
        if (nombreJours > 10) {
            throw new RuntimeException("Prolongation trop large");
        }

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

        // Vérifier si le profil a une inscription active
        Optional<LocalDate> dateFinInscription = inscriptionRepository.findDateFinDerniereInscriptionByProfil(profilId);
        if (dateFinInscription.isEmpty() || dateFinInscription.get().isBefore(LocalDate.now())) {
            throw new RuntimeException("Le profil n'a pas d'inscription active. Veuillez d'abord vous inscrire.");
        }

        // Calculer la nouvelle date de fin
        LocalDate nouvelleDateFin = pret.getDateFinPret().plusDays(nombreJours);

        // Vérifier que la nouvelle date ne dépasse pas la date de fin d'inscription
        if (nouvelleDateFin.isAfter(dateFinInscription.get())) {
            throw new RuntimeException("Date limite de l'inscription dépassée, veuillez d'abord vous réinscrire");
        }

        // Vérifier les quotas de prolongements
        Settings settings = settingsService.getCurrentSettings();
        int quotaMaxProlongements = settings.getQuotaByType(pret.getProfil().getAdherant().getType().getType());
        Long nbProlongementsActuels = pretRepository.countProlongementsByProfil(profilId);
        if (nbProlongementsActuels >= quotaMaxProlongements) {
            throw new RuntimeException("Quota de prolongements dépassé pour ce profil");
        }

        // Mettre à jour la date de fin de prêt
        pret.setDateFinPret(nouvelleDateFin);

        // Créer un objet ProlongementPret
        ProlongementPret prolongement = new ProlongementPret();
        prolongement.setPret(pret);
        prolongement.setDateDemande(java.time.LocalDateTime.now());
        prolongement.setNouvelleDateFin(nouvelleDateFin.atStartOfDay());
        prolongement.setStatut(1); // Approuvé

        prolongementPretRepository.save(prolongement);

        return pretRepository.save(pret);
    }
}