package com.sales;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*")
public class LeadController {

    private final LeadRepository leadRepository;
    private final LeadScoringService scoringService;

    public LeadController(LeadRepository leadRepository, LeadScoringService scoringService) {
        this.leadRepository = leadRepository;
        this.scoringService = scoringService;
    }

    // Create a new lead with duplicate check
    @PostMapping
    public ResponseEntity<?> createLead(@RequestBody Lead lead) {
        // Check for duplicates
        List<Lead> existingLeads = leadRepository.findAll();
        for (Lead existing : existingLeads) {
            if (existing.getEmail().equalsIgnoreCase(lead.getEmail())) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Duplicate lead found");
                error.put("existingLead", existing);
                return ResponseEntity.badRequest().body(error);
            }
        }
        
        // Auto-calculate lead score
        int score = scoringService.calculateLeadScore(lead);
        lead.setScore(score);
        
        Lead savedLead = leadRepository.save(lead);
        return ResponseEntity.ok(savedLead);
    }

    // Get all leads with scores
    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads() {
        List<Lead> leads = leadRepository.findAll();
        // Update scores
        for (Lead lead : leads) {
            int score = scoringService.calculateLeadScore(lead);
            lead.setScore(score);
        }
        return ResponseEntity.ok(leads);
    }

    // Get lead by ID
    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return leadRepository.findById(id)
                .map(lead -> {
                    int score = scoringService.calculateLeadScore(lead);
                    lead.setScore(score);
                    return ResponseEntity.ok(lead);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Get leads by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Lead>> getLeadsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(leadRepository.findByStatus(status));
    }

    // Update lead
    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @RequestBody Lead leadDetails) {
        return leadRepository.findById(id)
                .map(lead -> {
                    lead.setName(leadDetails.getName());
                    lead.setEmail(leadDetails.getEmail());
                    lead.setPhone(leadDetails.getPhone());
                    lead.setCompany(leadDetails.getCompany());
                    lead.setStatus(leadDetails.getStatus());
                    lead.setSource(leadDetails.getSource());
                    lead.setNotes(leadDetails.getNotes());
                    
                    // Update last contacted if status changed to CONTACTED
                    if ("CONTACTED".equals(leadDetails.getStatus()) && !"CONTACTED".equals(lead.getStatus())) {
                        lead.setLastContacted(LocalDateTime.now());
                    }
                    
                    // Recalculate score
                    int score = scoringService.calculateLeadScore(lead);
                    lead.setScore(score);
                    
                    Lead updated = leadRepository.save(lead);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete lead
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        if (!leadRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        leadRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    // Get lead recommendations
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<Map<String, Object>> getLeadRecommendations(@PathVariable Long id) {
        return leadRepository.findById(id)
                .map(lead -> {
                    int score = scoringService.calculateLeadScore(lead);
                    String priority = scoringService.getLeadPriority(score);
                    String action = scoringService.getRecommendedAction(lead);
                    
                    Map<String, Object> recommendations = new HashMap<>();
                    recommendations.put("score", score);
                    recommendations.put("priority", priority);
                    recommendations.put("recommendedAction", action);
                    recommendations.put("lead", lead);
                    
                    return ResponseEntity.ok(recommendations);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Search leads
    @GetMapping("/search")
    public ResponseEntity<List<Lead>> searchLeads(@RequestParam String query) {
        List<Lead> allLeads = leadRepository.findAll();
        List<Lead> results = allLeads.stream()
            .filter(lead -> 
                lead.getName().toLowerCase().contains(query.toLowerCase()) ||
                lead.getEmail().toLowerCase().contains(query.toLowerCase()) ||
                (lead.getCompany() != null && lead.getCompany().toLowerCase().contains(query.toLowerCase()))
            )
            .toList();
        return ResponseEntity.ok(results);
    }
}
