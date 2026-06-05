package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {
    List<Gallery> findByIsActiveTrueOrderByCreatedAtDesc();
    List<Gallery> findByCategoryAndIsActiveTrueOrderByCreatedAtDesc(Gallery.Category category);
}
