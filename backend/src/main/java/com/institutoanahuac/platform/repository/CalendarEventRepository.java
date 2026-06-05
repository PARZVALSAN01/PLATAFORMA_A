package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByIsActiveTrueOrderByStartDateAsc();
}
