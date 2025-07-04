package com.bibliotheque.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bibliotheque.entities.Categorie;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    Optional<Categorie> findByNom(String nom);
    
    @Query("SELECT c FROM Categorie c WHERE c.categorieParent IS NULL")
    List<Categorie> findCategoriesParent();
    
    @Query("SELECT c FROM Categorie c WHERE c.categorieParent.categorieId = :parentId")
    List<Categorie> findSousCategories(Long parentId);
}