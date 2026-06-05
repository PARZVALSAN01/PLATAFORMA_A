package com.institutoanahuac.platform.service;

import com.institutoanahuac.platform.entity.*;
import com.institutoanahuac.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final AnnouncementRepository announcementRepository;
    private final NewsRepository newsRepository;
    private final GalleryRepository galleryRepository;
    private final ContactRequestRepository contactRequestRepository;
    private final CalendarEventRepository calendarEventRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // Announcements
    @Transactional(readOnly = true)
    public List<Announcement> getAnnouncements() {
        return announcementRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Transactional
    public Announcement createAnnouncement(Announcement announcement, Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        announcement.setAuthor(author);
        return announcementRepository.save(announcement);
    }

    @Transactional
    public Announcement updateAnnouncement(Long id, Announcement data) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aviso no encontrado"));
        if (data.getTitle() != null) announcement.setTitle(data.getTitle());
        if (data.getContent() != null) announcement.setContent(data.getContent());
        if (data.getTarget() != null) announcement.setTarget(data.getTarget());
        if (data.getPriority() != null) announcement.setPriority(data.getPriority());
        return announcementRepository.save(announcement);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aviso no encontrado"));
        announcement.setIsActive(false);
        announcementRepository.save(announcement);
    }

    // News
    @Transactional(readOnly = true)
    public List<News> getPublicNews() {
        return newsRepository.findByIsPublishedTrueOrderByPublishedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<News> getAllNews() {
        return newsRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public News getNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Noticia no encontrada"));
    }

    @Transactional(readOnly = true)
    public News getPublicNewsById(Long id) {
        News news = getNewsById(id);
        if (!Boolean.TRUE.equals(news.getIsPublished())) {
            throw new RuntimeException("Noticia no encontrada");
        }
        return news;
    }

    @Transactional
    public News createNews(News news, Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        news.setAuthor(author);
        if (news.getIsPublished()) {
            news.setPublishedAt(LocalDateTime.now());
        }
        return newsRepository.save(news);
    }

    @Transactional
    public News updateNews(Long id, News data) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Noticia no encontrada"));
        if (data.getTitle() != null) news.setTitle(data.getTitle());
        if (data.getContent() != null) news.setContent(data.getContent());
        if (data.getExcerpt() != null) news.setExcerpt(data.getExcerpt());
        if (data.getCategory() != null) news.setCategory(data.getCategory());
        if (data.getIsPublished() != null) {
            news.setIsPublished(data.getIsPublished());
            if (data.getIsPublished() && news.getPublishedAt() == null) {
                news.setPublishedAt(LocalDateTime.now());
            }
        }
        return newsRepository.save(news);
    }

    @Transactional
    public void deleteNews(Long id) {
        newsRepository.deleteById(id);
    }

    // Gallery
    @Transactional(readOnly = true)
    public List<Gallery> getGallery(Gallery.Category category) {
        if (category != null) {
            return galleryRepository.findByCategoryAndIsActiveTrueOrderByCreatedAtDesc(category);
        }
        return galleryRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Transactional
    public Gallery addToGallery(String title, String description, Gallery.Category category,
                                MultipartFile file, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String originalName = file.getOriginalFilename() == null ? "upload" : Paths.get(file.getOriginalFilename()).getFileName().toString();
        String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String filename = UUID.randomUUID() + "_" + safeName;
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(), uploadPath.resolve(filename));

        Gallery gallery = Gallery.builder()
                .title(title)
                .description(description)
                .imageUrl("/uploads/" + filename)
                .category(category)
                .uploadedBy(user)
                .build();

        return galleryRepository.save(gallery);
    }

    @Transactional
    public void deleteFromGallery(Long id) {
        Gallery gallery = galleryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        gallery.setIsActive(false);
        galleryRepository.save(gallery);
    }

    // Contact
    @Transactional
    public ContactRequest createContactRequest(ContactRequest request) {
        return contactRequestRepository.save(request);
    }

    @Transactional(readOnly = true)
    public List<ContactRequest> getContactRequests() {
        return contactRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public ContactRequest updateContactRequest(Long id, ContactRequest data, Long userId) {
        ContactRequest request = contactRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        if (data.getStatus() != null) request.setStatus(data.getStatus());
        if (data.getReplyMessage() != null) {
            request.setReplyMessage(data.getReplyMessage());
            request.setRepliedAt(LocalDateTime.now());
            User repliedBy = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            request.setRepliedBy(repliedBy);
        }
        return contactRequestRepository.save(request);
    }

    // Calendar
    @Transactional(readOnly = true)
    public List<CalendarEvent> getCalendarEvents() {
        return calendarEventRepository.findByIsActiveTrueOrderByStartDateAsc();
    }

    @Transactional
    public CalendarEvent createCalendarEvent(CalendarEvent event, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        event.setCreatedBy(user);
        return calendarEventRepository.save(event);
    }

    @Transactional
    public CalendarEvent updateCalendarEvent(Long id, CalendarEvent data) {
        CalendarEvent event = calendarEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
        if (data.getTitle() != null) event.setTitle(data.getTitle());
        if (data.getDescription() != null) event.setDescription(data.getDescription());
        if (data.getStartDate() != null) event.setStartDate(data.getStartDate());
        if (data.getEndDate() != null) event.setEndDate(data.getEndDate());
        if (data.getType() != null) event.setType(data.getType());
        return calendarEventRepository.save(event);
    }

    @Transactional
    public void deleteCalendarEvent(Long id) {
        CalendarEvent event = calendarEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
        event.setIsActive(false);
        calendarEventRepository.save(event);
    }

    // Messages
    @Transactional(readOnly = true)
    public List<Message> getMessages(Long userId) {
        return messageRepository.findByRecipientIdOrSenderIdOrderByCreatedAtDesc(userId, userId);
    }

    @Transactional
    public Message sendMessage(Message message, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        message.setSender(sender);
        return messageRepository.save(message);
    }

    @Transactional
    public Message markAsRead(Long id, Long recipientId) {
        Message message = messageRepository.findByIdAndRecipientId(id, recipientId)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        message.setIsRead(true);
        message.setReadAt(LocalDateTime.now());
        return messageRepository.save(message);
    }
}
