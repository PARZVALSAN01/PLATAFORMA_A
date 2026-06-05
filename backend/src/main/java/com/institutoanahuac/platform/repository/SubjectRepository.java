package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByTeacherId(Long teacherId);
    List<Subject> findByIsActiveTrue();
}
