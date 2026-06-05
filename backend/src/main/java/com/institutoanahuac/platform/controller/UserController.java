package com.institutoanahuac.platform.controller;

import com.institutoanahuac.platform.dto.DashboardStats;
import com.institutoanahuac.platform.dto.UserDTO;
import com.institutoanahuac.platform.entity.User;
import com.institutoanahuac.platform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(userService.getDashboardStats());
    }

    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAll(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        User.Role roleEnum = role != null ? User.Role.valueOf(role) : null;
        return ResponseEntity.ok(userService.getAll(roleEnum, search, page, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody Map<String, String> body) {
        UserDTO dto = UserDTO.builder()
                .firstName(body.get("firstName"))
                .lastName(body.get("lastName"))
                .email(body.get("email"))
                .role(body.get("role"))
                .phone(body.get("phone"))
                .build();
        return ResponseEntity.ok(userService.create(dto, body.get("password")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        UserDTO dto = UserDTO.builder()
                .firstName(body.get("firstName"))
                .lastName(body.get("lastName"))
                .email(body.get("email"))
                .role(body.get("role"))
                .phone(body.get("phone"))
                .build();
        return ResponseEntity.ok(userService.update(id, dto, body.get("password")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> remove(@PathVariable Long id) {
        userService.remove(id);
        return ResponseEntity.ok(Map.of("message", "Usuario desactivado exitosamente"));
    }
}
