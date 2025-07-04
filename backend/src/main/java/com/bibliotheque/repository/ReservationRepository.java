package com.bibliotheque.repository;

import com.bibliotheque.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.profil.profilId = :profilId AND r.reservationStatus.statut IN (0, 1)")
    List<Reservation> findReservationsActivesByProfil(@Param("profilId") Long profilId);
    
    @Query("SELECT r FROM Reservation r WHERE r.reservationStatus.statut = 0")
    List<Reservation> findReservationsEnAttente();
    
    @Query("SELECT r FROM Reservation r WHERE r.reservationStatus.statut = 1")
    List<Reservation> findReservationsDisponibles();
    
    @Query("SELECT r FROM Reservation r WHERE r.dateExpiration < :date AND r.reservationStatus.statut IN (0, 1)")
    List<Reservation> findReservationsExpirees(@Param("date") LocalDate date);
    
    @Query("SELECT r FROM Reservation r WHERE r.exemplaire.livre.livreId = :livreId AND r.reservationStatus.statut = 0 ORDER BY r.dateResa ASC")
    List<Reservation> findReservationsEnAttenteByLivre(@Param("livreId") Long livreId);
    
    @Query("SELECT r FROM Reservation r WHERE r.exemplaire.exemplaireId = :exemplaireId AND r.profil.profilId = :profilId AND r.reservationStatus.statut IN (0, 1)")
    Reservation findActiveReservationByExemplaireAndProfil(@Param("exemplaireId") Long exemplaireId, @Param("profilId") Long profilId);
}