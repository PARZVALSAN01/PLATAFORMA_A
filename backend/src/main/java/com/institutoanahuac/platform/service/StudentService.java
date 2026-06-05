package com.institutoanahuac.platform.service;

import com.institutoanahuac.platform.dto.StudentRequest;
import com.institutoanahuac.platform.dto.StudentResponse;
import com.institutoanahuac.platform.entity.Student;
import com.institutoanahuac.platform.entity.User;
import com.institutoanahuac.platform.repository.StudentRepository;
import com.institutoanahuac.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public Page<StudentResponse> getAll(String search, String level, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

        Page<Student> students;
        if (search != null && !search.isEmpty()) {
            students = studentRepository.searchStudents(search, pageable);
        } else if (level != null && !level.isEmpty()) {
            students = studentRepository.findByLevelAndIsActiveTrue(
                    Student.Level.valueOf(level), pageable);
        } else {
            students = studentRepository.findByIsActiveTrue(pageable);
        }

        return students.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public StudentResponse getById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        return toResponse(student);
    }

    @Transactional(readOnly = true)
    public StudentResponse getByMatricula(String matricula) {
        Student student = studentRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado con matrícula: " + matricula));
        return toResponse(student);
    }

    @Transactional
    public StudentResponse create(StudentRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }
        if (studentRepository.existsByMatricula(request.getMatricula())) {
            throw new RuntimeException("La matrícula ya está registrada");
        }

        // Crear User
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getApellidoPaterno() + " " + request.getApellidoMaterno())
                .email(request.getEmail())
                .password(passwordEncoder.encode("Alumno123!"))
                .role(User.Role.student)
                .phone(request.getPhone())
                .build();
        user = userRepository.save(user);

        // Crear Student
        Student student = Student.builder()
                .user(user)
                .matricula(request.getMatricula())
                .apellidoPaterno(request.getApellidoPaterno())
                .apellidoMaterno(request.getApellidoMaterno())
                .level(Student.Level.valueOf(request.getLevel()))
                .grade(request.getGrade())
                .group(request.getGroup())
                .enrollmentDate(request.getEnrollmentDate() != null ? request.getEnrollmentDate() : java.time.LocalDate.now())
                .birthDate(request.getBirthDate())
                .bloodType(request.getBloodType())
                .allergies(request.getAllergies())
                .emergencyContact(request.getEmergencyContact())
                .emergencyPhone(request.getEmergencyPhone())
                // Dirección
                .street(request.getStreet())
                .colonia(request.getColonia())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                // Colegiatura
                .costoInscripcion(request.getCostoInscripcion())
                .costoColegiaturasMensual(request.getCostoColegiaturasMensual())
                .tipoBeca(request.getTipoBeca())
                .porcentajeBeca(request.getPorcentajeBeca())
                // Info padres
                .nombrePadre(request.getNombrePadre())
                .telefonoPadre(request.getTelefonoPadre())
                .emailPadre(request.getEmailPadre())
                .ocupacionPadre(request.getOcupacionPadre())
                .nombreMadre(request.getNombreMadre())
                .telefonoMadre(request.getTelefonoMadre())
                .emailMadre(request.getEmailMadre())
                .ocupacionMadre(request.getOcupacionMadre())
                .build();

        student = studentRepository.save(student);
        log.info("Alumno creado: {} - {}", student.getMatricula(), user.getEmail());
        return toResponse(student);
    }

    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        User user = student.getUser();

        // Verificar email único
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("El correo electrónico ya está registrado");
            }
            user.setEmail(request.getEmail());
        }

        // Verificar matrícula única
        if (request.getMatricula() != null && !request.getMatricula().equals(student.getMatricula())) {
            if (studentRepository.existsByMatricula(request.getMatricula())) {
                throw new RuntimeException("La matrícula ya está registrada");
            }
            student.setMatricula(request.getMatricula());
        }

        // Actualizar User
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getApellidoPaterno() != null && request.getApellidoMaterno() != null) {
            user.setLastName(request.getApellidoPaterno() + " " + request.getApellidoMaterno());
        }
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        userRepository.save(user);

        // Actualizar Student
        if (request.getApellidoPaterno() != null) student.setApellidoPaterno(request.getApellidoPaterno());
        if (request.getApellidoMaterno() != null) student.setApellidoMaterno(request.getApellidoMaterno());
        if (request.getLevel() != null) student.setLevel(Student.Level.valueOf(request.getLevel()));
        if (request.getGrade() != null) student.setGrade(request.getGrade());
        if (request.getGroup() != null) student.setGroup(request.getGroup());
        if (request.getEnrollmentDate() != null) student.setEnrollmentDate(request.getEnrollmentDate());
        if (request.getBirthDate() != null) student.setBirthDate(request.getBirthDate());
        if (request.getBloodType() != null) student.setBloodType(request.getBloodType());
        if (request.getAllergies() != null) student.setAllergies(request.getAllergies());
        if (request.getEmergencyContact() != null) student.setEmergencyContact(request.getEmergencyContact());
        if (request.getEmergencyPhone() != null) student.setEmergencyPhone(request.getEmergencyPhone());

        // Dirección
        if (request.getStreet() != null) student.setStreet(request.getStreet());
        if (request.getColonia() != null) student.setColonia(request.getColonia());
        if (request.getCity() != null) student.setCity(request.getCity());
        if (request.getState() != null) student.setState(request.getState());
        if (request.getZipCode() != null) student.setZipCode(request.getZipCode());

        // Colegiatura
        if (request.getCostoInscripcion() != null) student.setCostoInscripcion(request.getCostoInscripcion());
        if (request.getCostoColegiaturasMensual() != null) student.setCostoColegiaturasMensual(request.getCostoColegiaturasMensual());
        if (request.getTipoBeca() != null) student.setTipoBeca(request.getTipoBeca());
        if (request.getPorcentajeBeca() != null) student.setPorcentajeBeca(request.getPorcentajeBeca());

        // Info padres
        if (request.getNombrePadre() != null) student.setNombrePadre(request.getNombrePadre());
        if (request.getTelefonoPadre() != null) student.setTelefonoPadre(request.getTelefonoPadre());
        if (request.getEmailPadre() != null) student.setEmailPadre(request.getEmailPadre());
        if (request.getOcupacionPadre() != null) student.setOcupacionPadre(request.getOcupacionPadre());
        if (request.getNombreMadre() != null) student.setNombreMadre(request.getNombreMadre());
        if (request.getTelefonoMadre() != null) student.setTelefonoMadre(request.getTelefonoMadre());
        if (request.getEmailMadre() != null) student.setEmailMadre(request.getEmailMadre());
        if (request.getOcupacionMadre() != null) student.setOcupacionMadre(request.getOcupacionMadre());

        student = studentRepository.save(student);
        log.info("Alumno actualizado: {}", student.getMatricula());
        return toResponse(student);
    }

    @Transactional
    public void deactivate(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        student.setIsActive(false);
        student.getUser().setIsActive(false);
        studentRepository.save(student);
        userRepository.save(student.getUser());
        log.info("Alumno desactivado: {}", student.getMatricula());
    }

    @Transactional
    public StudentResponse uploadPhoto(Long id, MultipartFile file) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        // Validar tipo de archivo
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Solo se permiten archivos de imagen (jpg, png, webp)");
        }

        // Validar tamaño (5MB máximo)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("La imagen no debe superar los 5MB");
        }

        try {
            String extension = getFileExtension(file.getOriginalFilename());
            String fileName = "student_" + student.getMatricula() + "_" + UUID.randomUUID() + extension;

            Path uploadPath = Paths.get(uploadDir, "students");
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String photoUrl = "/uploads/students/" + fileName;
            student.setPhotoUrl(photoUrl);
            studentRepository.save(student);

            log.info("Foto actualizada para alumno: {}", student.getMatricula());
            return toResponse(student);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la foto: " + e.getMessage());
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return ".jpg";
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private StudentResponse toResponse(Student student) {
        User user = student.getUser();
        return StudentResponse.builder()
                .id(student.getId())
                .firstName(user.getFirstName())
                .apellidoPaterno(student.getApellidoPaterno())
                .apellidoMaterno(student.getApellidoMaterno())
                .email(user.getEmail())
                .phone(user.getPhone())
                .photoUrl(student.getPhotoUrl())
                .matricula(student.getMatricula())
                .level(student.getLevel().name())
                .grade(student.getGrade())
                .group(student.getGroup())
                .enrollmentDate(student.getEnrollmentDate())
                .birthDate(student.getBirthDate())
                .bloodType(student.getBloodType())
                .allergies(student.getAllergies())
                .emergencyContact(student.getEmergencyContact())
                .emergencyPhone(student.getEmergencyPhone())
                .street(student.getStreet())
                .colonia(student.getColonia())
                .city(student.getCity())
                .state(student.getState())
                .zipCode(student.getZipCode())
                .costoInscripcion(student.getCostoInscripcion())
                .costoColegiaturasMensual(student.getCostoColegiaturasMensual())
                .tipoBeca(student.getTipoBeca())
                .porcentajeBeca(student.getPorcentajeBeca())
                .nombrePadre(student.getNombrePadre())
                .telefonoPadre(student.getTelefonoPadre())
                .emailPadre(student.getEmailPadre())
                .ocupacionPadre(student.getOcupacionPadre())
                .nombreMadre(student.getNombreMadre())
                .telefonoMadre(student.getTelefonoMadre())
                .emailMadre(student.getEmailMadre())
                .ocupacionMadre(student.getOcupacionMadre())
                .isActive(student.getIsActive())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .userId(user.getId())
                .build();
    }

    @Transactional
    public Map<String, Object> bulkImport(List<StudentRequest> students) {
        int imported = 0;
        int errors = 0;
        List<String> errorMessages = new ArrayList<>();

        for (StudentRequest req : students) {
            try {
                create(req);
                imported++;
            } catch (Exception e) {
                errors++;
                errorMessages.add((req.getMatricula() != null ? req.getMatricula() : "Fila " + (imported + errors)) + ": " + e.getMessage());
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("imported", imported);
        result.put("errors", errors);
        result.put("errorMessages", errorMessages);
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCobranzaStats() {
        List<Student> allStudents = studentRepository.findByIsActiveTrue();
        BigDecimal totalPronostico = BigDecimal.ZERO;
        BigDecimal totalColegiaturas = BigDecimal.ZERO;
        int conBeca = 0;
        int sinBeca = 0;
        Map<String, Integer> porNivel = new LinkedHashMap<>();

        for (Student s : allStudents) {
            BigDecimal mensualidad = s.getCostoColegiaturasMensual() != null ? s.getCostoColegiaturasMensual() : BigDecimal.ZERO;
            BigDecimal inscripcion = s.getCostoInscripcion() != null ? s.getCostoInscripcion() : BigDecimal.ZERO;
            BigDecimal porcentajeBeca = s.getPorcentajeBeca() != null ? s.getPorcentajeBeca() : BigDecimal.ZERO;
            BigDecimal descuento = mensualidad.multiply(porcentajeBeca).divide(BigDecimal.valueOf(100));
            BigDecimal mensualidadConBeca = mensualidad.subtract(descuento);

            totalPronostico = totalPronostico.add(inscripcion).add(mensualidadConBeca.multiply(BigDecimal.valueOf(12)));
            totalColegiaturas = totalColegiaturas.add(mensualidadConBeca);

            if (porcentajeBeca.compareTo(BigDecimal.ZERO) > 0) conBeca++;
            else sinBeca++;

            String nivel = s.getLevel() != null ? s.getLevel().name() : "otro";
            porNivel.merge(nivel, 1, Integer::sum);
        }

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalAlumnos", allStudents.size());
        stats.put("totalPronosticoAnual", totalPronostico);
        stats.put("totalColegiaturasMensual", totalColegiaturas);
        stats.put("alumnosConBeca", conBeca);
        stats.put("alumnosSinBeca", sinBeca);
        stats.put("porNivel", porNivel);
        return stats;
    }
}
