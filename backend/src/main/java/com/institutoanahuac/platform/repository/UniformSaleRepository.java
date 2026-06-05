package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.UniformSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface UniformSaleRepository extends JpaRepository<UniformSale, Long> {
    List<UniformSale> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM UniformSale s WHERE s.estado = 'pagado'")
    BigDecimal totalPagado();

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM UniformSale s WHERE s.estado = 'pendiente'")
    BigDecimal totalPendiente();

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM UniformSale s")
    BigDecimal totalGeneral();

    List<UniformSale> findByEstadoOrderByCreatedAtDesc(String estado);
}
