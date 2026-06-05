package com.institutoanahuac.platform.config;

import com.institutoanahuac.platform.entity.*;
import com.institutoanahuac.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassGroupRepository classGroupRepository;
    private final AnnouncementRepository announcementRepository;
    private final NewsRepository newsRepository;
    private final CalendarEventRepository calendarEventRepository;
    private final GalleryRepository galleryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            ensureDevUsers();
            log.info("Base de datos ya contiene datos. Usuarios de desarrollo verificados.");
            return;
        }

        log.info("Iniciando seed de datos...");

        // === USERS ===
        User admin = userRepository.save(User.builder()
                .firstName("Administrador")
                .lastName("Sistema")
                .email("admin@institutoanahuac.edu.mx")
                .password(passwordEncoder.encode("Admin123!"))
                .role(User.Role.admin)
                .phone("8141234567")
                .build());

        User teacherUser1 = userRepository.save(User.builder()
                .firstName("María")
                .lastName("González López")
                .email("maria.gonzalez@institutoanahuac.edu.mx")
                .password(passwordEncoder.encode("Docente123!"))
                .role(User.Role.teacher)
                .phone("8149876543")
                .build());

        User teacherUser2 = userRepository.save(User.builder()
                .firstName("Carlos")
                .lastName("Hernández Ruiz")
                .email("carlos.hernandez@institutoanahuac.edu.mx")
                .password(passwordEncoder.encode("Docente123!"))
                .role(User.Role.teacher)
                .phone("8145551234")
                .build());

        User studentUser1 = userRepository.save(User.builder()
                .firstName("Ana Sofía")
                .lastName("Martínez Pérez")
                .email("ana.martinez@institutoanahuac.edu.mx")
                .password(passwordEncoder.encode("Alumno123!"))
                .role(User.Role.student)
                .build());

        User studentUser2 = userRepository.save(User.builder()
                .firstName("Diego")
                .lastName("López García")
                .email("diego.lopez@institutoanahuac.edu.mx")
                .password(passwordEncoder.encode("Alumno123!"))
                .role(User.Role.student)
                .build());

        User parentUser = userRepository.save(User.builder()
                .firstName("Roberto")
                .lastName("Martínez Sánchez")
                .email("roberto.martinez@gmail.com")
                .password(passwordEncoder.encode("Padre123!"))
                .role(User.Role.parent)
                .phone("8147778899")
                .build());

        // === TEACHERS ===
        Teacher teacher1 = teacherRepository.save(Teacher.builder()
                .user(teacherUser1)
                .employeeId("DOC-001")
                .specialization("Matemáticas")
                .education("Licenciatura en Matemáticas Aplicadas")
                .hireDate(LocalDate.of(2018, 8, 1))
                .build());

        Teacher teacher2 = teacherRepository.save(Teacher.builder()
                .user(teacherUser2)
                .employeeId("DOC-002")
                .specialization("Español")
                .education("Licenciatura en Letras Hispánicas")
                .hireDate(LocalDate.of(2019, 8, 1))
                .build());

        // === SUBJECTS ===
        Subject math = subjectRepository.save(Subject.builder()
                .name("Matemáticas")
                .code("MAT-6A")
                .level(Student.Level.primaria)
                .grade(6)
                .teacher(teacher1)
                .description("Matemáticas para 6° de primaria")
                .build());

        Subject spanish = subjectRepository.save(Subject.builder()
                .name("Español")
                .code("ESP-6A")
                .level(Student.Level.primaria)
                .grade(6)
                .teacher(teacher2)
                .description("Español para 6° de primaria")
                .build());

        teacher1.setSubjects(new ArrayList<>(List.of(math)));
        teacherRepository.save(teacher1);
        teacher2.setSubjects(new ArrayList<>(List.of(spanish)));
        teacherRepository.save(teacher2);

        // === STUDENTS ===
        Student student1 = studentRepository.save(Student.builder()
                .user(studentUser1)
                .matricula("ALU-2025-001")
                .apellidoPaterno("Martínez")
                .apellidoMaterno("Pérez")
                .level(Student.Level.primaria)
                .grade(6)
                .group("A")
                .enrollmentDate(LocalDate.of(2019, 8, 15))
                .birthDate(LocalDate.of(2013, 5, 15))
                .bloodType("O+")
                .emergencyContact("Roberto Martínez")
                .emergencyPhone("8147778899")
                .street("Av. Constitución 456")
                .colonia("Del Valle")
                .city("Monterrey")
                .state("Nuevo León")
                .zipCode("64000")
                .costoInscripcion(new java.math.BigDecimal("5000.00"))
                .costoColegiaturasMensual(new java.math.BigDecimal("4500.00"))
                .nombrePadre("Roberto Martínez Sánchez")
                .telefonoPadre("8147778899")
                .emailPadre("roberto.martinez@gmail.com")
                .ocupacionPadre("Ingeniero")
                .nombreMadre("Laura Pérez Gómez")
                .telefonoMadre("8147778800")
                .emailMadre("laura.perez@gmail.com")
                .ocupacionMadre("Doctora")
                .build());

        Student student2 = studentRepository.save(Student.builder()
                .user(studentUser2)
                .matricula("ALU-2025-002")
                .apellidoPaterno("López")
                .apellidoMaterno("García")
                .level(Student.Level.primaria)
                .grade(6)
                .group("A")
                .enrollmentDate(LocalDate.of(2019, 8, 15))
                .birthDate(LocalDate.of(2013, 8, 22))
                .bloodType("A+")
                .emergencyContact("Laura López")
                .emergencyPhone("8143334455")
                .street("Calle Hidalgo 789")
                .colonia("Centro")
                .city("Monterrey")
                .state("Nuevo León")
                .zipCode("64010")
                .costoInscripcion(new java.math.BigDecimal("5000.00"))
                .costoColegiaturasMensual(new java.math.BigDecimal("4500.00"))
                .tipoBeca("Académica")
                .porcentajeBeca(new java.math.BigDecimal("20.00"))
                .nombrePadre("Miguel López Ramírez")
                .telefonoPadre("8143334455")
                .emailPadre("miguel.lopez@gmail.com")
                .ocupacionPadre("Contador")
                .nombreMadre("Carmen García Torres")
                .telefonoMadre("8143334466")
                .emailMadre("carmen.garcia@gmail.com")
                .ocupacionMadre("Abogada")
                .build());

        // === PARENT ===
        parentRepository.save(Parent.builder()
                .user(parentUser)
                .children(new ArrayList<>(List.of(student1)))
                .occupation("Ingeniero")
                .workPhone("8141112233")
                .address("Col. Del Valle, Monterrey, N.L.")
                .relationship(Parent.Relationship.padre)
                .build());

        // === CLASS ===
        classGroupRepository.save(ClassGroup.builder()
                .name("6° Primaria A")
                .level(Student.Level.primaria)
                .grade(6)
                .group("A")
                .teacher(teacher1)
                .students(new ArrayList<>(List.of(student1, student2)))
                .subjects(new ArrayList<>(List.of(math, spanish)))
                .schoolYear("2025-2026")
                .build());

        // === ANNOUNCEMENTS ===
        announcementRepository.save(Announcement.builder()
                .title("Bienvenidos al ciclo escolar 2025-2026")
                .content("Damos la más cordial bienvenida a toda nuestra comunidad educativa al nuevo ciclo escolar. Estamos comprometidos con brindar la mejor educación para sus hijos.")
                .author(admin)
                .target(Announcement.Target.all)
                .priority(Announcement.Priority.important)
                .build());

        announcementRepository.save(Announcement.builder()
                .title("Junta de padres de familia")
                .content("Se convoca a todos los padres de familia a la primera junta del ciclo escolar que se llevará a cabo el próximo viernes a las 5:00 PM en el auditorio principal.")
                .author(admin)
                .target(Announcement.Target.parents)
                .priority(Announcement.Priority.normal)
                .build());

        // === NEWS ===
        newsRepository.save(News.builder()
                .title("Alumnos destacan en Olimpiada de Matemáticas")
                .content("Nos llena de orgullo compartir que nuestros alumnos obtuvieron medallas de oro y plata en la Olimpiada Regional de Matemáticas, destacando el nivel académico de nuestro instituto.")
                .excerpt("Nuestros alumnos brillan en competencia regional")
                .author(admin)
                .category(News.NewsCategory.academico)
                .isPublished(true)
                .publishedAt(LocalDateTime.now())
                .build());

        newsRepository.save(News.builder()
                .title("Nueva sección de Preparatoria")
                .content("A partir del ciclo 2026-2027, el Instituto Anáhuac ofrecerá el nivel preparatoria, ampliando nuestra oferta educativa para acompañar a los alumnos en su desarrollo integral.")
                .excerpt("Ampliamos nuestra oferta educativa")
                .author(admin)
                .category(News.NewsCategory.general)
                .isPublished(true)
                .publishedAt(LocalDateTime.now())
                .build());

        // === CALENDAR ===
        calendarEventRepository.save(CalendarEvent.builder()
                .title("Inicio de clases")
                .description("Primer día del ciclo escolar 2025-2026")
                .startDate(LocalDateTime.of(2025, 8, 25, 8, 0))
                .endDate(LocalDateTime.of(2025, 8, 25, 14, 0))
                .type(CalendarEvent.EventType.academic)
                .createdBy(admin)
                .build());

        calendarEventRepository.save(CalendarEvent.builder()
                .title("Día de la Independencia")
                .description("Ceremonia cívica y festividades patrias")
                .startDate(LocalDateTime.of(2025, 9, 15, 9, 0))
                .endDate(LocalDateTime.of(2025, 9, 16, 14, 0))
                .type(CalendarEvent.EventType.holiday)
                .color("#c8a960")
                .createdBy(admin)
                .build());

        calendarEventRepository.save(CalendarEvent.builder()
                .title("Exámenes del primer trimestre")
                .description("Período de evaluaciones del primer trimestre")
                .startDate(LocalDateTime.of(2025, 11, 17, 8, 0))
                .endDate(LocalDateTime.of(2025, 11, 21, 14, 0))
                .type(CalendarEvent.EventType.exam)
                .color("#dc2626")
                .createdBy(admin)
                .build());

        // === GALLERY ===
        galleryRepository.save(Gallery.builder()
                .title("Fachada principal")
                .description("Vista frontal del Instituto Anáhuac")
                .imageUrl("/uploads/fachada.jpg")
                .category(Gallery.Category.instalaciones)
                .uploadedBy(admin)
                .build());

        galleryRepository.save(Gallery.builder()
                .title("Área de juegos")
                .description("Zona recreativa para alumnos de primaria")
                .imageUrl("/uploads/juegos.jpg")
                .category(Gallery.Category.instalaciones)
                .uploadedBy(admin)
                .build());

        galleryRepository.save(Gallery.builder()
                .title("Cancha deportiva")
                .description("Cancha multiusos techada")
                .imageUrl("/uploads/cancha.jpg")
                .category(Gallery.Category.deportes)
                .uploadedBy(admin)
                .build());

        log.info("Seed completado exitosamente!");
    }

    private void ensureDevUsers() {
        ensureDevUser("Administrador", "Sistema", "admin@institutoanahuac.edu.mx", "Admin123!", User.Role.admin, "8141234567");

        User teacher1 = ensureDevUser("María", "González López", "maria.gonzalez@institutoanahuac.edu.mx", "Docente123!", User.Role.teacher, "8149876543");
        User teacher2 = ensureDevUser("Carlos", "Hernández Ruiz", "carlos.hernandez@institutoanahuac.edu.mx", "Docente123!", User.Role.teacher, "8145551234");
        User student1 = ensureDevUser("Ana Sofía", "Martínez Pérez", "ana.martinez@institutoanahuac.edu.mx", "Alumno123!", User.Role.student, null);
        User student2 = ensureDevUser("Diego", "López García", "diego.lopez@institutoanahuac.edu.mx", "Alumno123!", User.Role.student, null);
        User parentUser = ensureDevUser("Roberto", "Martínez Sánchez", "roberto.martinez@gmail.com", "Padre123!", User.Role.parent, "8147778899");

        Teacher mathTeacher = teacherRepository.findByUserId(teacher1.getId()).orElseGet(() -> teacherRepository.save(Teacher.builder()
                .user(teacher1)
                .employeeId("DOC-001")
                .specialization("Matemáticas")
                .education("Licenciatura en Matemáticas Aplicadas")
                .hireDate(LocalDate.of(2018, 8, 1))
                .build()));
        teacherRepository.findByUserId(teacher2.getId()).orElseGet(() -> teacherRepository.save(Teacher.builder()
                .user(teacher2)
                .employeeId("DOC-002")
                .specialization("Español")
                .education("Licenciatura en Letras Hispánicas")
                .hireDate(LocalDate.of(2019, 8, 1))
                .build()));

        Student ana = studentRepository.findByUserId(student1.getId()).orElseGet(() -> studentRepository.save(Student.builder()
                .user(student1)
                .matricula("ALU-2025-001")
                .level(Student.Level.primaria)
                .grade(6)
                .group("A")
                .enrollmentDate(LocalDate.of(2019, 8, 15))
                .build()));
        Student diego = studentRepository.findByUserId(student2.getId()).orElseGet(() -> studentRepository.save(Student.builder()
                .user(student2)
                .matricula("ALU-2025-002")
                .level(Student.Level.primaria)
                .grade(6)
                .group("A")
                .enrollmentDate(LocalDate.of(2019, 8, 15))
                .build()));

        parentRepository.findByUserId(parentUser.getId()).orElseGet(() -> parentRepository.save(Parent.builder()
                .user(parentUser)
                .children(new ArrayList<>(List.of(ana)))
                .relationship(Parent.Relationship.padre)
                .build()));

        if (classGroupRepository.findByStudentId(ana.getId()).isEmpty()) {
            classGroupRepository.save(ClassGroup.builder()
                    .name("6° Primaria A")
                    .level(Student.Level.primaria)
                    .grade(6)
                    .group("A")
                    .teacher(mathTeacher)
                    .students(new ArrayList<>(List.of(ana, diego)))
                    .schoolYear("2025-2026")
                    .build());
        }
    }

    private User ensureDevUser(String firstName, String lastName, String email, String password, User.Role role, String phone) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> User.builder()
                        .email(email)
                        .build());

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setPhone(phone);
        user.setIsActive(true);
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }
}
