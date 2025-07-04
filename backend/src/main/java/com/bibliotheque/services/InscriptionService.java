package com.bibliotheque.services;

import com.bibliotheque.entities.Inscription;
import com.bibliotheque.entities.TarifInscription;
import com.bibliotheque.entities.InscriptionStatus;
import com.bibliotheque.repository.InscriptionRepository;
import com.bibliotheque.repository.TarifInscriptionRepository;
import com.bibliotheque.repository.InscriptionStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InscriptionService {
    @Autowired
    private InscriptionRepository inscriptionRepository;
    @Autowired
    private TarifInscriptionRepository tarifInscriptionRepository;
    @Autowired
    private InscriptionStatusRepository inscriptionStatusRepository;

    public Inscription addInscription(Inscription inscription) {
        return inscriptionRepository.save(inscription);
    }

    public List<Inscription> getAllInscriptions() {
        return inscriptionRepository.findAll();
    }

    public Optional<Inscription> getInscription(Long id) {
        return inscriptionRepository.findById(id);
    }

    public List<TarifInscription> getAllTarifs() {
        return tarifInscriptionRepository.findAll();
    }

    public TarifInscription getTarif(Long id) {
        return tarifInscriptionRepository.findById(id).orElse(null);
    }

    public InscriptionStatus addInscriptionStatus(InscriptionStatus status) {
        return inscriptionStatusRepository.save(status);
    }

    public List<InscriptionStatus> getAllInscriptionStatus() {
        return inscriptionStatusRepository.findAll();
    }
} 