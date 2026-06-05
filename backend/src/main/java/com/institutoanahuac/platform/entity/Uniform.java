package com.institutoanahuac.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "uniforms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Uniform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String talla;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock;

    private String categoria; // escolar, deportivo, gala

    private String nivel; // primaria, secundaria, preparatoria

    private String genero; // masculino, femenino, unisex

    private String descripcion;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @Builder.Default
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
