package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.ClassGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
    List<ClassGroup> findByTeacherId(Long teacherId);

    @Query("SELECT c FROM ClassGroup c JOIN c.students s WHERE s.id = :studentId")
    List<ClassGroup> findByStudentId(@Param("studentId") Long studentId);

    List<ClassGroup> findByIsActiveTrue();
}
