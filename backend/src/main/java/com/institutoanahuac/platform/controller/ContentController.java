package com.institutoanahuac.platform.controller;

import com.institutoanahuac.platform.entity.*;
import com.institutoanahuac.platform.security.UserPrincipal;
import com.institutoanahuac.platform.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    // === PUBLIC ENDPOINTS ===

    @GetMapping("/news/public")
    public ResponseEntity<List<News>> getPublicNews() {
        return ResponseEntity.ok(contentService.getPublicNews());
    }

    @GetMapping("/news/public/{id}")
    public ResponseEntity<News> getPublicNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getPublicNewsById(id));
    }

    @GetMapping("/gallery/public")
    public ResponseEntity<List<Gallery>> getPublicGallery(
            @RequestParam(required = false) String category) {
        Gallery.Category cat = category != null ? Gallery.Category.valueOf(category) : null;
        return ResponseEntity.ok(contentService.getGallery(cat));
    }

    @GetMapping("/calendar/public")
    public ResponseEntity<List<CalendarEvent>> getPublicCalendar() {
        return ResponseEntity.ok(contentService.getCalendarEvents());
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactRequest> createContact(@RequestBody ContactRequest request) {
        return ResponseEntity.ok(contentService.createContactRequest(request));
    }

    // === AUTHENTICATED ENDPOINTS ===

    // Announcements
    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> getAnnouncements() {
        return ResponseEntity.ok(contentService.getAnnouncements());
    }

    @PostMapping("/announcements")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Announcement> createAnnouncement(
            @RequestBody Announcement announcement,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(contentService.createAnnouncement(announcement, principal.getId()));
    }

    @PutMapping("/announcements/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Announcement> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Announcement announcement) {
        return ResponseEntity.ok(contentService.updateAnnouncement(id, announcement));
    }

    @DeleteMapping("/announcements/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteAnnouncement(@PathVariable Long id) {
        contentService.deleteAnnouncement(id);
        return ResponseEntity.ok(Map.of("message", "Aviso eliminado exitosamente"));
    }

    // News (Admin)
    @GetMapping("/news")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<News>> getAllNews() {
        return ResponseEntity.ok(contentService.getAllNews());
    }

    @PostMapping("/news")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<News> createNews(
            @RequestBody News news,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(contentService.createNews(news, principal.getId()));
    }

    @PutMapping("/news/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<News> updateNews(@PathVariable Long id, @RequestBody News news) {
        return ResponseEntity.ok(contentService.updateNews(id, news));
    }

    @DeleteMapping("/news/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteNews(@PathVariable Long id) {
        contentService.deleteNews(id);
        return ResponseEntity.ok(Map.of("message", "Noticia eliminada exitosamente"));
    }

    // Gallery (Admin)
    @PostMapping("/gallery")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Gallery> addToGallery(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(defaultValue = "general") String category,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {
        return ResponseEntity.ok(contentService.addToGallery(
                title, description, Gallery.Category.valueOf(category), file, principal.getId()));
    }

    @DeleteMapping("/gallery/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteFromGallery(@PathVariable Long id) {
        contentService.deleteFromGallery(id);
        return ResponseEntity.ok(Map.of("message", "Imagen eliminada exitosamente"));
    }

    // Contacts (Admin)
    @GetMapping("/contacts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactRequest>> getContacts() {
        return ResponseEntity.ok(contentService.getContactRequests());
    }

    @PutMapping("/contacts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactRequest> updateContact(
            @PathVariable Long id,
            @RequestBody ContactRequest data,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(contentService.updateContactRequest(id, data, principal.getId()));
    }

    // Calendar
    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarEvent>> getCalendar() {
        return ResponseEntity.ok(contentService.getCalendarEvents());
    }

    @PostMapping("/calendar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CalendarEvent> createEvent(
            @RequestBody CalendarEvent event,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(contentService.createCalendarEvent(event, principal.getId()));
    }

    @PutMapping("/calendar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CalendarEvent> updateEvent(
            @PathVariable Long id,
            @RequestBody CalendarEvent event) {
        return ResponseEntity.ok(contentService.updateCalendarEvent(id, event));
    }

    @DeleteMapping("/calendar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id) {
        contentService.deleteCalendarEvent(id);
        return ResponseEntity.ok(Map.of("message", "Evento eliminado exitosamente"));
    }

    // Messages
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(contentService.getMessages(principal.getId()));
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> sendMessage(
            @RequestBody Message message,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(contentService.sendMessage(message, principal.getId()));
    }

    @PutMapping("/messages/{id}/read")
    public ResponseEntity<Message> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(contentService.markAsRead(id, principal.getId()));
    }
}
