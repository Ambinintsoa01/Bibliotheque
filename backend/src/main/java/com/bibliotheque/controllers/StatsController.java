package com.bibliotheque.controllers;

import com.bibliotheque.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Locale;

@RestController
@RequestMapping("/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {

    @Autowired
    private LivreRepository livreRepository;

    @Autowired
    private ProfilRepository profilRepository;

    @Autowired
    private PretRepository pretRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private PenaliteRepository penaliteRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Total des livres
            long totalBooks = livreRepository.count();
            stats.put("totalBooks", totalBooks);
            
            // Total des utilisateurs avec inscription active
            long totalUsers = inscriptionRepository.countUtilisateursAvecInscriptionActive(LocalDate.now());
            stats.put("totalUsers", totalUsers);
            
            // Prêts actifs (non rendus)
            long activeLoans = pretRepository.countByDateRenduIsNull();
            stats.put("activeLoans", activeLoans);
            
            // Réservations en attente
            long pendingReservations = reservationRepository.countReservationsEnAttente();
            stats.put("pendingReservations", pendingReservations);
            
            // Prêts en retard
            long overdueLoans = pretRepository.countByDateFinPretBeforeAndDateRenduIsNull(LocalDate.now());
            stats.put("overdueLoans", overdueLoans);
            
            // Total des pénalités actives (montant en euros)
            BigDecimal totalPenalties = penaliteRepository.getTotalPenalitesActives();
            stats.put("totalPenalties", totalPenalties != null ? totalPenalties.doubleValue() : 0.0);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/activites-recentes")
    public ResponseEntity<List<Map<String, Object>>> getActivitesRecentes() {
        try {
            List<Map<String, Object>> activites = new ArrayList<>();
            
            // Prêts récents (7 derniers jours)
            List<Object[]> pretsRecents = pretRepository.findRecentPrets(LocalDate.now().minusDays(7));
            for (Object[] pret : pretsRecents) {
                Map<String, Object> activite = new HashMap<>();
                activite.put("id", "pret_" + pret[0]);
                activite.put("message", "Nouveau prêt: \"" + pret[1] + "\" par " + pret[2] + " " + pret[3]);
                activite.put("time", calculateTimeAgo((LocalDate) pret[4]));
                activite.put("type", "pret");
                activite.put("date", pret[4]);
                activites.add(activite);
            }
            
            // Retours récents
            List<Object[]> retoursRecents = pretRepository.findRecentReturns(LocalDate.now().minusDays(7));
            for (Object[] retour : retoursRecents) {
                Map<String, Object> activite = new HashMap<>();
                activite.put("id", "retour_" + retour[0]);
                activite.put("message", "Retour: \"" + retour[1] + "\" par " + retour[2] + " " + retour[3]);
                activite.put("time", calculateTimeAgo((LocalDate) retour[4]));
                activite.put("type", "retour");
                activite.put("date", retour[4]);
                activites.add(activite);
            }
            
            // Nouvelles réservations
            List<Object[]> reservationsRecentes = reservationRepository.findRecentReservations(LocalDate.now().minusDays(7));
            for (Object[] reservation : reservationsRecentes) {
                Map<String, Object> activite = new HashMap<>();
                activite.put("id", "reservation_" + reservation[0]);
                activite.put("message", "Nouvelle réservation: \"" + reservation[1] + "\" par " + reservation[2] + " " + reservation[3]);
                activite.put("time", calculateTimeAgo((LocalDate) reservation[4]));
                activite.put("type", "reservation");
                activite.put("date", reservation[4]);
                activites.add(activite);
            }
            
            // Trier par date (plus récent en premier) et limiter à 10
            activites.sort((a, b) -> {
                LocalDate dateA = (LocalDate) a.get("date");
                LocalDate dateB = (LocalDate) b.get("date");
                return dateB.compareTo(dateA); // Tri décroissant
            });
            
            return ResponseEntity.ok(activites.subList(0, Math.min(activites.size(), 10)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.emptyList());
        }
    }

    @GetMapping("/prets-par-mois")
    public ResponseEntity<List<Map<String, Object>>> getPretsParMois() {
        try {
            List<Map<String, Object>> pretsParMois = new ArrayList<>();
            
            // Obtenir les prêts par mois pour l'année en cours
            int currentYear = LocalDate.now().getYear();
            List<Object[]> pretsMensuels = pretRepository.findPretsByMonth(currentYear);
            
            // Créer un map pour tous les mois
            Map<Integer, Long> pretsParMoisMap = new HashMap<>();
            for (int i = 1; i <= 12; i++) {
                pretsParMoisMap.put(i, 0L);
            }
            
            // Remplir avec les données réelles
            for (Object[] pret : pretsMensuels) {
                Integer mois = (Integer) pret[0];
                Long count = (Long) pret[1];
                pretsParMoisMap.put(mois, count);
            }
            
            // Trouver le maximum pour calculer les pourcentages
            long maxPrets = pretsParMoisMap.values().stream().mapToLong(Long::longValue).max().orElse(1);
            
            // Créer la liste de réponse
            for (int mois = 1; mois <= 12; mois++) {
                Map<String, Object> moisData = new HashMap<>();
                long count = pretsParMoisMap.get(mois);
                double pourcentage = maxPrets > 0 ? (count * 100.0 / maxPrets) : 0;
                
                moisData.put("mois", mois);
                moisData.put("count", count);
                moisData.put("pourcentage", Math.round(pourcentage));
                pretsParMois.add(moisData);
            }
            
            return ResponseEntity.ok(pretsParMois);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.emptyList());
        }
    }

    private String calculateTimeAgo(LocalDate date) {
        long days = LocalDate.now().toEpochDay() - date.toEpochDay();
        if (days == 0) return "Aujourd'hui";
        if (days == 1) return "Hier";
        if (days < 7) return "Il y a " + days + " jours";
        if (days < 30) return "Il y a " + (days / 7) + " semaines";
        return "Il y a " + (days / 30) + " mois";
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getDetailedStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Statistiques mensuelles (6 derniers mois)
            List<Map<String, Object>> monthlyStats = new ArrayList<>();
            for (int i = 5; i >= 0; i--) {
                LocalDate monthStart = LocalDate.now().minusMonths(i).withDayOfMonth(1);
                LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
                
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", monthStart.format(DateTimeFormatter.ofPattern("MMM", Locale.FRENCH)));
                
                // Prêts du mois
                long loans = pretRepository.countByDatePretBetween(monthStart, monthEnd);
                monthData.put("loans", loans);
                
                // Retours du mois
                long returns = pretRepository.countByDateRenduBetween(monthStart, monthEnd);
                monthData.put("returns", returns);
                
                // Nouveaux utilisateurs du mois
                long newUsers = profilRepository.countByDateInscriptionBetween(monthStart, monthEnd);
                monthData.put("newUsers", newUsers);
                
                monthlyStats.add(monthData);
            }
            stats.put("monthlyData", monthlyStats);
            
            // Livres les plus empruntés
            List<Object[]> topBooks = pretRepository.findTopBooksByLoans();
            List<Map<String, Object>> topBooksList = new ArrayList<>();
            for (Object[] book : topBooks) {
                Map<String, Object> bookData = new HashMap<>();
                bookData.put("titre", book[0]);
                bookData.put("emprunts", book[1]);
                bookData.put("auteur", book[2]);
                topBooksList.add(bookData);
            }
            stats.put("topBooks", topBooksList);
            
            // Répartition des utilisateurs par type
            List<Object[]> userTypes = profilRepository.findUserDistributionByType();
            List<Map<String, Object>> userStats = new ArrayList<>();
            long totalUsers = profilRepository.count();
            
            for (Object[] userType : userTypes) {
                Map<String, Object> typeData = new HashMap<>();
                typeData.put("type", userType[0]);
                typeData.put("count", userType[1]);
                double percentage = totalUsers > 0 ? ((Long) userType[1] * 100.0 / totalUsers) : 0;
                typeData.put("percentage", Math.round(percentage));
                userStats.add(typeData);
            }
            stats.put("userStats", userStats);
            
            // Statistiques générales
            long totalLoans = pretRepository.count();
            long totalReturns = pretRepository.countByDateRenduIsNotNull();
            double returnRate = totalLoans > 0 ? (totalReturns * 100.0 / totalLoans) : 0;
            
            stats.put("totalLoans", totalLoans);
            stats.put("totalReturns", totalReturns);
            stats.put("returnRate", Math.round(returnRate * 10) / 10.0);
            stats.put("mostPopularBookLoans", topBooksList.isEmpty() ? 0 : topBooksList.get(0).get("emprunts"));
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
} 