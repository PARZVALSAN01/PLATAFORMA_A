package com.institutoanahuac.platform.service;

import com.institutoanahuac.platform.entity.*;
import com.institutoanahuac.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicService {

    private final AssignmentRepository assignmentRepository;
    private final GradeRepository gradeRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ClassGroupRepository classGroupRepository;
    private final SubjectRepository subjectRepository;

    @Transactional(readOnly = true)
    public List<ClassGroup> getClassesForUser(Long userId, String role) {
        if ("teacher".equals(role)) {
            Teacher teacher = teacherRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
            return classGroupRepository.findByTeacherId(teacher.getId());
        }
        if ("student".equals(role)) {
            Student student = studentRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            return classGroupRepository.findByStudentId(student.getId());
        }
        if ("parent".equals(role)) {
            Parent parent = parentRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Padre de familia no encontrado"));
            return parent.getChildren().stream()
                    .flatMap(child -> classGroupRepository.findByStudentId(child.getId()).stream())
                    .distinct()
                    .toList();
        }
        return classGroupRepository.findByIsActiveTrue();
    }

    // Assignments
    @Transactional(readOnly = true)
    public List<Assignment> getAssignmentsForUser(Long userId, String role) {
        if ("teacher".equals(role)) {
            Teacher teacher = teacherRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
            return assignmentRepository.findByTeacherIdAndIsActiveTrue(teacher.getId());
        }
        if ("student".equals(role)) {
            return getStudentAssignments(userId);
        }
        if ("parent".equals(role)) {
            Parent parent = parentRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Padre de familia no encontrado"));
            List<Long> classIds = parent.getChildren().stream()
                    .flatMap(child -> classGroupRepository.findByStudentId(child.getId()).stream())
                    .map(ClassGroup::getId)
                    .distinct()
                    .toList();
            return classIds.isEmpty() ? List.of() : assignmentRepository.findByClassGroupIdInAndIsActiveTrue(classIds);
        }
        return assignmentRepository.findByIsActiveTrueOrderByDueDateDesc();
    }

    @Transactional(readOnly = true)
    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
    }

    @Transactional(readOnly = true)
    public List<Assignment> getStudentAssignments(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        List<ClassGroup> classes = classGroupRepository.findByStudentId(student.getId());
        List<Assignment> assignments = new ArrayList<>();
        for (ClassGroup c : classes) {
            assignments.addAll(assignmentRepository.findByClassGroupIdAndIsActiveTrue(c.getId()));
        }
        return assignments;
    }

    @Transactional
    public Assignment createAssignment(Assignment assignment, Long userId, String role) {
        if ("teacher".equals(role)) {
            Teacher teacher = teacherRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
            assignment.setTeacher(teacher);
        } else if (assignment.getTeacher() == null || assignment.getTeacher().getId() == null) {
            throw new RuntimeException("La tarea requiere un docente");
        }
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public Assignment updateAssignment(Long id, Assignment data, Long userId, String role) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        ensureTeacherOwnsAssignment(assignment, userId, role);
        if (data.getTitle() != null) assignment.setTitle(data.getTitle());
        if (data.getDescription() != null) assignment.setDescription(data.getDescription());
        if (data.getDueDate() != null) assignment.setDueDate(data.getDueDate());
        if (data.getMaxScore() != null) assignment.setMaxScore(data.getMaxScore());
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void deleteAssignment(Long id, Long userId, String role) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        ensureTeacherOwnsAssignment(assignment, userId, role);
        assignment.setIsActive(false);
        assignmentRepository.save(assignment);
    }

    // Grades
    @Transactional(readOnly = true)
    public List<Grade> getGradesForUser(Long userId, String role, Long studentId, Long subjectId, String schoolYear) {
        if ("student".equals(role)) {
            Student student = studentRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
            return filterGrades(gradeRepository.findByStudentId(student.getId()), null, subjectId, schoolYear);
        }
        if ("parent".equals(role)) {
            Parent parent = parentRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Padre de familia no encontrado"));
            List<Long> childIds = parent.getChildren().stream().map(Student::getId).toList();
            if (studentId != null && !childIds.contains(studentId)) {
                throw new RuntimeException("No tienes permisos para ver estas calificaciones");
            }
            List<Grade> grades = studentId != null
                    ? gradeRepository.findByStudentId(studentId)
                    : (childIds.isEmpty() ? List.of() : gradeRepository.findByStudentIdIn(childIds));
            return filterGrades(grades, null, subjectId, schoolYear);
        }
        if ("teacher".equals(role)) {
            Teacher teacher = teacherRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
            return filterGrades(gradeRepository.findByTeacherId(teacher.getId()), studentId, subjectId, schoolYear);
        }
        return getGrades(studentId, subjectId, schoolYear);
    }

    private List<Grade> getGrades(Long studentId, Long subjectId, String schoolYear) {
        if (studentId != null && subjectId != null) {
            return gradeRepository.findByStudentIdAndSubjectId(studentId, subjectId);
        }
        if (studentId != null && schoolYear != null) {
            return gradeRepository.findByStudentIdAndSchoolYear(studentId, schoolYear);
        }
        if (studentId != null) {
            return gradeRepository.findByStudentId(studentId);
        }
        return gradeRepository.findAll();
    }

    @Transactional
    public Grade createGrade(Grade grade, Long userId, String role) {
        if ("teacher".equals(role)) {
            Teacher teacher = teacherRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
            grade.setTeacher(teacher);
        } else if (grade.getTeacher() == null || grade.getTeacher().getId() == null) {
            throw new RuntimeException("La calificación requiere un docente");
        }
        return gradeRepository.save(grade);
    }

    @Transactional
    public Grade updateGrade(Long id, Grade data, Long userId, String role) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Calificación no encontrada"));
        ensureTeacherOwnsGrade(grade, userId, role);
        if (data.getScore() != null) grade.setScore(data.getScore());
        if (data.getComments() != null) grade.setComments(data.getComments());
        if (data.getPeriod() != null) grade.setPeriod(data.getPeriod());
        return gradeRepository.save(grade);
    }

    private List<Grade> filterGrades(List<Grade> grades, Long studentId, Long subjectId, String schoolYear) {
        return grades.stream()
                .filter(g -> studentId == null || g.getStudent().getId().equals(studentId))
                .filter(g -> subjectId == null || g.getSubject().getId().equals(subjectId))
                .filter(g -> schoolYear == null || schoolYear.equals(g.getSchoolYear()))
                .toList();
    }

    private void ensureTeacherOwnsAssignment(Assignment assignment, Long userId, String role) {
        if (!"teacher".equals(role)) return;
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        if (assignment.getTeacher() == null || !assignment.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("No tienes permisos para modificar esta tarea");
        }
    }

    private void ensureTeacherOwnsGrade(Grade grade, Long userId, String role) {
        if (!"teacher".equals(role)) return;
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        if (grade.getTeacher() == null || !grade.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("No tienes permisos para modificar esta calificación");
        }
    }
}
