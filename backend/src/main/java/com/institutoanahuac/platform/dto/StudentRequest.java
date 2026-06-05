package com.institutoanahuac.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StudentRequest {

    // Datos del usuario
    @NotBlank(message = "El nombre es requerido")
    private String firstName;

    @NotBlank(message = "El apellido paterno es requerido")
    private String apellidoPaterno;

    @NotBlank(message = "El apellido materno es requerido")
    private String apellidoMaterno;

    @NotBlank(message = "El correo electrónico es requerido")
    @Email(message = "Correo electrónico no válido")
    private String email;

    private String phone;

    // Datos escolares
    @NotBlank(message = "La matrícula es requerida")
    private String matricula;

    @NotNull(message = "El nivel es requerido")
    private String level;

    @NotNull(message = "El grado es requerido")
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
}
