package com.sales;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class LeadScoringService {

    public int calculateLeadScore(Lead lead) {
        int score = 0;
        
        // Base score for having complete information
        if (lead.getName() != null && !lead.getName().isEmpty()) score += 10;
        if (lead.getEmail() != null && !lead.getEmail().isEmpty()) score += 10;
        if (lead.getPhone() != null && !lead.getPhone().isEmpty()) score += 10;
        if (lead.getCompany() != null && !lead.getCompany().isEmpty()) score += 15;
        
        // Score based on status
        switch (lead.getStatus()) {
            case "NEW": score += 20; break;
            case "CONTACTED": score += 40; break;
            case "QUALIFIED": score += 80; break;
        }
        
        // Score based on source quality
        if (lead.getSource() != null) {
            switch (lead.getSource()) {
                case "Referral": score += 25; break;
                case "LinkedIn": score += 20; break;
                case "Website": score += 15; break;
                case "Trade Show": score += 15; break;
                case "Email Campaign": score += 10; break;
                case "Cold Call": score += 5; break;
            }
        }
        
        // Recency score - leads contacted recently are more valuable
        if (lead.getLastContacted() != null) {
            long daysSinceContact = ChronoUnit.DAYS.between(lead.getLastContacted(), LocalDateTime.now());
            if (daysSinceContact <= 7) score += 15;
            else if (daysSinceContact <= 30) score += 10;
            else if (daysSinceContact <= 90) score += 5;
        }
        
        // Cap score at 100
        return Math.min(score, 100);
    }
    
    public String getLeadPriority(int score) {
        if (score >= 80) return "HOT";
        if (score >= 60) return "WARM";
        if (score >= 40) return "COLD";
        return "FROZEN";
    }
    
    public String getRecommendedAction(Lead lead) {
        int score = calculateLeadScore(lead);
        String priority = getLeadPriority(score);
        
        if ("HOT".equals(priority)) {
            return "Contact immediately! High conversion potential.";
        } else if ("WARM".equals(priority)) {
            return "Schedule follow-up within 24 hours.";
        } else if ("COLD".equals(priority)) {
            return "Add to nurture campaign.";
        } else {
            return "Re-qualify or archive.";
        }
    }
}
