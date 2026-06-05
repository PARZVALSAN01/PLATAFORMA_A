package com.institutoanahuac.platform.controller;

import com.institutoanahuac.platform.entity.Assignment;
import com.institutoanahuac.platform.entity.ClassGroup;
import com.institutoanahuac.platform.entity.Grade;
import com.institutoanahuac.platform.security.UserPrincipal;
import com.institutoanahuac.platform.service.AcademicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic")
@RequiredArgsConstructor
public class AcademicController {

    private final AcademicService academicService;

    @GetMapping("/classes")
    public ResponseEntity<List<ClassGroup>> getClasses(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.getClassesForUser(principal.getId(), principal.getRole()));
    }

    // Assignments
    @GetMapping("/assignments")
    public ResponseEntity<List<Assignment>> getAssignments(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.getAssignmentsForUser(principal.getId(), principal.getRole()));
    }

    @GetMapping("/assignments/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Assignment>> getStudentAssignments(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.getStudentAssignments(principal.getId()));
    }

    @GetMapping("/assignments/{id}")
    public ResponseEntity<Assignment> getAssignment(@PathVariable Long id) {
        return ResponseEntity.ok(academicService.getAssignmentById(id));
    }

    @PostMapping("/assignments")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Assignment> createAssignment(
            @RequestBody Assignment assignment,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.createAssignment(assignment, principal.getId(), principal.getRole()));
    }

    @PutMapping("/assignments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Assignment> updateAssignment(
            @PathVariable Long id,
            @RequestBody Assignment assignment,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.updateAssignment(id, assignment, principal.getId(), principal.getRole()));
    }

    @DeleteMapping("/assignments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Map<String, String>> deleteAssignment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        academicService.deleteAssignment(id, principal.getId(), principal.getRole());
        return ResponseEntity.ok(Map.of("message", "Tarea eliminada exitosamente"));
    }

    // Grades
    @GetMapping("/grades")
    public ResponseEntity<List<Grade>> getGrades(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String schoolYear,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.getGradesForUser(
                principal.getId(), principal.getRole(), studentId, subjectId, schoolYear));
    }

    @PostMapping("/grades")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Grade> createGrade(
            @RequestBody Grade grade,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.createGrade(grade, principal.getId(), principal.getRole()));
    }

    @PutMapping("/grades/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Grade> updateGrade(
            @PathVariable Long id,
            @RequestBody Grade grade,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(academicService.updateGrade(id, grade, principal.getId(), principal.getRole()));
    }
}
