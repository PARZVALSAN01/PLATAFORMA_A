package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByStudentIdIn(List<Long> studentIds);
    List<Grade> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    List<Grade> findByStudentIdAndSchoolYear(Long studentId, String schoolYear);
    List<Grade> findByTeacherId(Long teacherId);
    List<Grade> findByTeacherIdAndStudentId(Long teacherId, Long studentId);
    List<Grade> findByTeacherIdAndSubjectId(Long teacherId, Long subjectId);
}
