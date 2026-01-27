package com.sales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    // Find leads by status (NEW, CONTACTED, QUALIFIED, LOST)
    List<Lead> findByStatus(String status);

    // Find lead by email
    Lead findByEmail(String email);
}
