package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByTeacherIdAndIsActiveTrue(Long teacherId);
    List<Assignment> findByClassGroupIdAndIsActiveTrue(Long classId);
    List<Assignment> findByClassGroupIdInAndIsActiveTrue(List<Long> classIds);
    List<Assignment> findBySubjectIdAndIsActiveTrue(Long subjectId);
    List<Assignment> findByIsActiveTrueOrderByDueDateDesc();
}
