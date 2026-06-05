package com.institutoanahuac.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {

    private Long id;

    // Datos personales
    private String firstName;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String email;
    private String phone;
    private String photoUrl;

    // Datos escolares
    private String matricula;
    private String level;
    private Integer grade;
    private String group;
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
    private BigDecimal costoInscripcion;
    private BigDecimal costoColegiaturasMensual;
    private String tipoBeca;
    private BigDecimal porcentajeBeca;

    // Info padres
    private String nombrePadre;
    private String telefonoPadre;
    private String emailPadre;
    private String ocupacionPadre;
    private String nombreMadre;
    private String telefonoMadre;
    private String emailMadre;
    private String ocupacionMadre;

    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ID del usuario asociado
    private Long userId;
}
