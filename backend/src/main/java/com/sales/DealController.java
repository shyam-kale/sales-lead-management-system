package com.sales;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@CrossOrigin(origins = "*")
public class DealController {

    private final DealRepository dealRepository;
    private final LeadRepository leadRepository;

    public DealController(DealRepository dealRepository, LeadRepository leadRepository) {
        this.dealRepository = dealRepository;
        this.leadRepository = leadRepository;
    }

    // Create a new deal for a lead
    @PostMapping("/lead/{leadId}")
    public ResponseEntity<Deal> createDeal(
            @PathVariable Long leadId,
            @RequestBody Deal deal) {

        return leadRepository.findById(leadId)
                .map(lead -> {
                    deal.setLead(lead);
                    Deal savedDeal = dealRepository.save(deal);
                    return ResponseEntity.ok(savedDeal);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new deal without lead
    @PostMapping
    public ResponseEntity<Deal> createDealWithoutLead(@RequestBody Deal deal) {
        Deal savedDeal = dealRepository.save(deal);
        return ResponseEntity.ok(savedDeal);
    }

    // Update deal
    @PutMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(@PathVariable Long id, @RequestBody Deal dealDetails) {
        return dealRepository.findById(id)
                .map(deal -> {
                    deal.setTitle(dealDetails.getTitle());
                    deal.setDescription(dealDetails.getDescription());
                    deal.setAmount(dealDetails.getAmount());
                    deal.setStage(dealDetails.getStage());
                    deal.setProbability(dealDetails.getProbability());
                    deal.setExpectedCloseDate(dealDetails.getExpectedCloseDate());
                    deal.setNotes(dealDetails.getNotes());
                    Deal updated = dealRepository.save(deal);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all deals
    @GetMapping
    public ResponseEntity<List<Deal>> getAllDeals() {
        return ResponseEntity.ok(dealRepository.findAll());
    }

    // Get deals by stage
    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<Deal>> getDealsByStage(@PathVariable String stage) {
        return ResponseEntity.ok(dealRepository.findByStage(stage));
    }

    // Get deals for a specific lead
    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<Deal>> getDealsByLead(@PathVariable Long leadId) {
        return ResponseEntity.ok(dealRepository.findByLeadId(leadId));
    }

    // Delete deal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeal(@PathVariable Long id) {
        if (!dealRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dealRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
