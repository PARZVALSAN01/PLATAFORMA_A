package com.institutoanahuac.platform.service;

import com.institutoanahuac.platform.dto.DashboardStats;
import com.institutoanahuac.platform.dto.UserDTO;
import com.institutoanahuac.platform.entity.*;
import com.institutoanahuac.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UserDTO> getAll(User.Role role, String search, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<User> users;

        if (role != null && search != null && !search.isEmpty()) {
            users = userRepository.findByRoleAndFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                    role, search, search, pageable);
        } else if (role != null) {
            users = userRepository.findByRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(this::toUserDTO);
    }

    @Transactional(readOnly = true)
    public UserDTO getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return toUserDTO(user);
    }

    @Transactional
    public UserDTO create(UserDTO dto, String password) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(password))
                .role(User.Role.valueOf(dto.getRole()))
                .phone(dto.getPhone())
                .build();

        user = userRepository.save(user);

        // Create profile based on role
        switch (user.getRole()) {
            case student -> {
        Student student = Student.builder()
                        .user(user)
                        .matricula("ALU-" + System.currentTimeMillis())
                        .level(Student.Level.primaria)
                        .grade(1)
                        .group("A")
                        .build();
                studentRepository.save(student);
            }
            case teacher -> {
                Teacher teacher = Teacher.builder()
                        .user(user)
                        .employeeId("DOC-" + System.currentTimeMillis())
                        .build();
                teacherRepository.save(teacher);
            }
            case parent -> {
                Parent parent = Parent.builder()
                        .user(user)
                        .build();
                parentRepository.save(parent);
            }
            default -> {}
        }

        return toUserDTO(user);
    }

    @Transactional
    public UserDTO update(Long id, UserDTO dto, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("El email ya está registrado");
            }
            user.setEmail(dto.getEmail());
        }
        if (dto.getRole() != null) user.setRole(User.Role.valueOf(dto.getRole()));
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        user = userRepository.save(user);
        return toUserDTO(user);
    }

    @Transactional
    public void remove(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        return DashboardStats.builder()
                .totalUsers(userRepository.countByIsActiveTrue())
                .totalStudents(studentRepository.countByIsActiveTrue())
                .totalTeachers(teacherRepository.countByIsActiveTrue())
                .totalParents(parentRepository.count())
                .build();
    }

    private UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .isActive(user.getIsActive())
                .build();
    }
}
