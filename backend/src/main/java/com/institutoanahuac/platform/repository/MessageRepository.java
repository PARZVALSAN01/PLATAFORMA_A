package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    List<Message> findBySenderIdOrderByCreatedAtDesc(Long senderId);
    List<Message> findByRecipientIdOrSenderIdOrderByCreatedAtDesc(Long recipientId, Long senderId);
    Optional<Message> findByIdAndRecipientId(Long id, Long recipientId);
}
