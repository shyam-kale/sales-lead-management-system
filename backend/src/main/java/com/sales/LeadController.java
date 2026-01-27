package com.sales;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "http://localhost:3000")
public class LeadController {

    private final LeadRepository leadRepository;

    public LeadController(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    // Create a new lead
    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead) {
        Lead savedLead = leadRepository.save(lead);
        return ResponseEntity.ok(savedLead);
    }

    // Get all leads
    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadRepository.findAll());
    }

    // Get lead by ID
    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return leadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get leads by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Lead>> getLeadsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(leadRepository.findByStatus(status));
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
}
