package com.sales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    List<Activity> findByUserIdOrderByActivityDateDesc(Long userId);
    
    List<Activity> findByLeadIdOrderByActivityDateDesc(Long leadId);
    
    List<Activity> findByDealIdOrderByActivityDateDesc(Long dealId);
    
    @Query("SELECT a FROM Activity a WHERE a.activityDate >= :startDate AND a.activityDate <= :endDate ORDER BY a.activityDate DESC")
    List<Activity> findByActivityDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Activity a WHERE a.user.id = :userId AND a.activityDate >= :startDate AND a.activityDate <= :endDate ORDER BY a.activityDate DESC")
    List<Activity> findByUserIdAndActivityDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}