package com.bibliotheque.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("SELECT n FROM Notification n WHERE n.profil.profilId = :profilId ORDER BY n.dateEnvoi DESC")
    List<Notification> findByProfilOrderByDateEnvoiDesc(@Param("profilId") Long profilId);
    
    @Query("SELECT n FROM Notification n WHERE n.profil.profilId = :profilId AND n.notificationStatus.statut = 0 ORDER BY n.dateEnvoi DESC")
    List<Notification> findNotificationsNonLuesByProfil(@Param("profilId") Long profilId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.profil.profilId = :profilId AND n.notificationStatus.statut = 0")
    Long countNotificationsNonLuesByProfil(@Param("profilId") Long profilId);

    @Query("SELECT n FROM Notification n ORDER BY n.dateEnvoi DESC")
    List<Notification> findAllOrderByDateEnvoiDesc();

    List<Notification> findByProfil_ProfilIdOrderByDateEnvoiDesc(Long profilId);
}