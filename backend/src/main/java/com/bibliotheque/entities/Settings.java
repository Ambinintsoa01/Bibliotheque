package com.bibliotheque.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "settings")
public class Settings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Paramètres de pénalité
    private double dailyPenalty;
    private double maxPenalty;
    private int gracePeriod;

    // Paramètres de prêt
    private int defaultLoanDuration;
    private int maxRenewals;
    private int reminderDays;

    // Quotas
    private int studentQuota;
    private int professorQuota;
    private int professionalQuota;
    private int anonymousQuota;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public double getDailyPenalty() { return dailyPenalty; }
    public void setDailyPenalty(double dailyPenalty) { this.dailyPenalty = dailyPenalty; }
    public double getMaxPenalty() { return maxPenalty; }
    public void setMaxPenalty(double maxPenalty) { this.maxPenalty = maxPenalty; }
    public int getGracePeriod() { return gracePeriod; }
    public void setGracePeriod(int gracePeriod) { this.gracePeriod = gracePeriod; }
    public int getDefaultLoanDuration() { return defaultLoanDuration; }
    public void setDefaultLoanDuration(int defaultLoanDuration) { this.defaultLoanDuration = defaultLoanDuration; }
    public int getMaxRenewals() { return maxRenewals; }
    public void setMaxRenewals(int maxRenewals) { this.maxRenewals = maxRenewals; }
    public int getReminderDays() { return reminderDays; }
    public void setReminderDays(int reminderDays) { this.reminderDays = reminderDays; }
    public int getStudentQuota() { return studentQuota; }
    public void setStudentQuota(int studentQuota) { this.studentQuota = studentQuota; }
    public int getProfessorQuota() { return professorQuota; }
    public void setProfessorQuota(int professorQuota) { this.professorQuota = professorQuota; }
    public int getProfessionalQuota() { return professionalQuota; }
    public void setProfessionalQuota(int professionalQuota) { this.professionalQuota = professionalQuota; }
    public int getAnonymousQuota() { return anonymousQuota; }
    public void setAnonymousQuota(int anonymousQuota) { this.anonymousQuota = anonymousQuota; }
    public int getQuotaByType(String type) {
        switch (type) {
            case "Prof": return getProfessorQuota();
            case "Etudiant": return getStudentQuota();
            case "Professionnel": return getProfessionalQuota();
            case "Anonyme": return getAnonymousQuota();
            default: return 2;
        }
    }
} 