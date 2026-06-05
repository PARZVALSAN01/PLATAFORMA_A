package com.institutoanahuac.platform.repository;

import com.institutoanahuac.platform.entity.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
    List<ContactRequest> findAllByOrderByCreatedAtDesc();
    List<ContactRequest> findByStatus(ContactRequest.Status status);
}
