package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Page<User> findByRole(User.Role role, Pageable pageable);
    Page<User> findByRoleAndFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        User.Role role, String firstName, String lastName, Pageable pageable);
    long countByRole(User.Role role);
    long countByIsActiveTrue();
}
