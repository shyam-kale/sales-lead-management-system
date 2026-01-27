package com.sales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    // Find deals by pipeline stage
    List<Deal> findByStage(String stage);

    // Find deals linked to a specific lead
    List<Deal> findByLeadId(Long leadId);
}
