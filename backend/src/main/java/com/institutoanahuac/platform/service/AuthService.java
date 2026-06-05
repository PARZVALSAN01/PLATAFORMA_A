package com.institutoanahuac.platform.service;

import com.institutoanahuac.platform.dto.*;
import com.institutoanahuac.platform.entity.*;
import com.institutoanahuac.platform.repository.*;
import com.institutoanahuac.platform.security.JwtTokenProvider;
import com.institutoanahuac.platform.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private static final Set<String> PUBLIC_REGISTER_ROLES = Set.of("student", "parent");

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        if (!PUBLIC_REGISTER_ROLES.contains(request.getRole())) {
            throw new RuntimeException("El registro público solo permite alumnos o padres de familia");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.valueOf(request.getRole()))
                .phone(request.getPhone())
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateTokenFromUser(user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .user(toUserDTO(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Object profile = loadProfile(user);

        return AuthResponse.builder()
                .token(token)
                .user(toUserDTO(user))
                .profile(profile)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Object profile = loadProfile(user);

        return AuthResponse.builder()
                .user(toUserDTO(user))
                .profile(profile)
                .build();
    }

    @Transactional
    public UserDTO updateProfile(Long userId, String firstName, String lastName, String phone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (phone != null) user.setPhone(phone);

        user = userRepository.save(user);
        return toUserDTO(user);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private Object loadProfile(User user) {
        return switch (user.getRole()) {
            case student -> studentRepository.findByUserId(user.getId()).orElse(null);
            case teacher -> teacherRepository.findByUserId(user.getId()).orElse(null);
            case parent -> parentRepository.findByUserId(user.getId()).orElse(null);
            default -> null;
        };
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
