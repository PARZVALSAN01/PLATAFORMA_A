package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByMatricula(String matricula);
    boolean existsByMatricula(String matricula);
    long countByIsActiveTrue();
    Page<Student> findByIsActiveTrue(Pageable pageable);
    List<Student> findByIsActiveTrue();
    Page<Student> findByLevelAndIsActiveTrue(Student.Level level, Pageable pageable);

    @Query("SELECT s FROM Student s JOIN s.user u WHERE s.isActive = true AND " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.apellidoPaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.apellidoMaterno) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.matricula) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> searchStudents(@Param("search") String search, Pageable pageable);
}
