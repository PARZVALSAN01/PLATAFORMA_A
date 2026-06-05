package com.institutoanahuac.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private String apellidoPaterno;

    @Column(nullable = false)
    private String apellidoMaterno;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Level level;

    @Column(nullable = false)
    private Integer grade;

    @Column(name = "group_name")
    private String group;

    @ManyToMany(mappedBy = "children")
    @Builder.Default
    private List<Parent> parents = new ArrayList<>();

    private LocalDate enrollmentDate;

    private LocalDate birthDate;

    private String bloodType;

    private String allergies;

    private String emergencyContact;

    private String emergencyPhone;

    // Dirección
    private String street;

    private String colonia;

    private String city;

    private String state;

    private String zipCode;

    // Colegiatura
    @Column(precision = 10, scale = 2)
    private BigDecimal costoInscripcion;

    @Column(precision = 10, scale = 2)
    private BigDecimal costoColegiaturasMensual;

    private String tipoBeca;

    @Column(precision = 5, scale = 2)
    private BigDecimal porcentajeBeca;

    // Foto
    private String photoUrl;

    // Info padres embebida (adicional a relación ManyToMany)
    private String nombrePadre;

    private String telefonoPadre;

    private String emailPadre;

    private String ocupacionPadre;

    private String nombreMadre;

    private String telefonoMadre;

    private String emailMadre;

    private String ocupacionMadre;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Level {
        primaria, secundaria, preparatoria
    }
}
