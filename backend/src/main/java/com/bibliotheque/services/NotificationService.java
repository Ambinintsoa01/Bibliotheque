package com.bibliotheque.services;

import com.bibliotheque.entities.*;
import com.bibliotheque.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public List<Notification> getNotificationsByProfil(Long profilId) {
        return notificationRepository.findByProfil_ProfilIdOrderByDateEnvoiDesc(profilId);
    }
    
    public List<Notification> getNotificationsNonLues(Long profilId) {
        return notificationRepository.findNotificationsNonLuesByProfil(profilId);
    }
    
    public Long countNotificationsNonLues(Long profilId) {
        return notificationRepository.countNotificationsNonLuesByProfil(profilId);
    }
    
    public Notification createNotification(Profil profil, String message, Integer type) {
        Notification notification = new Notification(profil, message, LocalDateTime.now());
        notification = notificationRepository.save(notification);
        
        // Créer le type de notification
        NotificationType notificationType = new NotificationType(notification, type);
        notification.setNotificationType(notificationType);
        
        // Créer le statut de notification
        NotificationStatus notificationStatus = new NotificationStatus(notification);
        notification.setNotificationStatus(notificationStatus);
        
        return notificationRepository.save(notification);
    }
    
    public void marquerCommeLue(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        
        notification.getNotificationStatus().setStatut(1); // Lu
        notificationRepository.save(notification);
    }
    
    public void envoyerRappelRetour(Pret pret) {
        String message = String.format("Rappel: votre livre \"%s\" doit être rendu le %s",
                pret.getExemplaire().getLivre().getTitre(),
                pret.getDateFinPret().toString());
        
        createNotification(pret.getProfil(), message, 0); // Type: Rappel
    }
    
    public void envoyerNotificationRetard(Pret pret) {
        String message = String.format("Votre livre \"%s\" est en retard. Veuillez le rendre rapidement pour éviter des pénalités.",
                pret.getExemplaire().getLivre().getTitre());
        
        createNotification(pret.getProfil(), message, 0); // Type: Rappel
    }
    
    public void envoyerNotificationDisponibilite(Reservation reservation) {
        String message = String.format("Votre réservation pour le livre \"%s\" est maintenant disponible. Vous avez jusqu'au %s pour le récupérer.",
                reservation.getExemplaire().getLivre().getTitre(),
                reservation.getDateExpiration().toString());
        
        createNotification(reservation.getProfil(), message, 2); // Type: Disponibilité
    }
    
    public void envoyerNotificationPenalite(Penalite penalite) {
        String message = String.format("Une pénalité de %.2f€ a été appliquée à votre compte. Raison: %s",
                penalite.getMontant(),
                penalite.getRaisons());
        
        createNotification(penalite.getProfil(), message, 1); // Type: Pénalité
    }
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllOrderByDateEnvoiDesc();
    }
}