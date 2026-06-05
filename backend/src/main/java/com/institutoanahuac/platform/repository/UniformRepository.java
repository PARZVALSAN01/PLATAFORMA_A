package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.Uniform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface UniformRepository extends JpaRepository<Uniform, Long> {
    List<Uniform> findByIsActiveTrueOrderByNombreAsc();

    @Query("SELECT u FROM Uniform u WHERE u.isActive = true AND " +
           "(LOWER(u.nombre) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(u.categoria) LIKE LOWER(CONCAT('%',:q,'%')))")
    List<Uniform> search(String q);

    List<Uniform> findByNivelAndIsActiveTrue(String nivel);
}
