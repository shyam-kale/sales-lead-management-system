package com.sales;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final LeadScoringService scoringService;

    public AnalyticsController(LeadRepository leadRepository, DealRepository dealRepository, LeadScoringService scoringService) {
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.scoringService = scoringService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        List<Lead> leads = leadRepository.findAll();
        List<Deal> deals = dealRepository.findAll();
        
        Map<String, Object> analytics = new HashMap<>();
        
        // Lead metrics
        analytics.put("totalLeads", leads.size());
        analytics.put("newLeads", leads.stream().filter(l -> "NEW".equals(l.getStatus())).count());
        analytics.put("qualifiedLeads", leads.stream().filter(l -> "QUALIFIED".equals(l.getStatus())).count());
        analytics.put("contactedLeads", leads.stream().filter(l -> "CONTACTED".equals(l.getStatus())).count());
        
        // Deal metrics
        analytics.put("totalDeals", deals.size());
        analytics.put("closedDeals", deals.stream().filter(d -> "CLOSED".equals(d.getStage())).count());
        analytics.put("totalRevenue", deals.stream()
            .filter(d -> "CLOSED".equals(d.getStage()))
            .mapToDouble(d -> d.getAmount() != null ? d.getAmount().doubleValue() : 0)
            .sum());
        analytics.put("pipelineValue", deals.stream()
            .filter(d -> !"CLOSED".equals(d.getStage()))
            .mapToDouble(d -> d.getAmount() != null ? d.getAmount().doubleValue() : 0)
            .sum());
        
        // Conversion rate
        long qualified = (long) analytics.get("qualifiedLeads");
        long total = (long) analytics.get("totalLeads");
        analytics.put("conversionRate", total > 0 ? (qualified * 100.0 / total) : 0);
        
        // Win rate
        long closed = (long) analytics.get("closedDeals");
        long totalDeals = (long) analytics.get("totalDeals");
        analytics.put("winRate", totalDeals > 0 ? (closed * 100.0 / totalDeals) : 0);
        
        // Average deal size
        double revenue = (double) analytics.get("totalRevenue");
        analytics.put("avgDealSize", closed > 0 ? revenue / closed : 0);
        
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/lead-sources")
    public ResponseEntity<Map<String, Long>> getLeadSourceAnalytics() {
        List<Lead> leads = leadRepository.findAll();
        Map<String, Long> sourceCount = leads.stream()
            .collect(Collectors.groupingBy(
                l -> l.getSource() != null ? l.getSource() : "Unknown",
                Collectors.counting()
            ));
        return ResponseEntity.ok(sourceCount);
    }

    @GetMapping("/lead-priorities")
    public ResponseEntity<Map<String, Object>> getLeadPriorities() {
        List<Lead> leads = leadRepository.findAll();
        
        Map<String, List<Lead>> priorityGroups = new HashMap<>();
        priorityGroups.put("HOT", new ArrayList<>());
        priorityGroups.put("WARM", new ArrayList<>());
        priorityGroups.put("COLD", new ArrayList<>());
        priorityGroups.put("FROZEN", new ArrayList<>());
        
        for (Lead lead : leads) {
            int score = scoringService.calculateLeadScore(lead);
            lead.setScore(score);
            String priority = scoringService.getLeadPriority(score);
            priorityGroups.get(priority).add(lead);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("hot", priorityGroups.get("HOT"));
        result.put("warm", priorityGroups.get("WARM"));
        result.put("cold", priorityGroups.get("COLD"));
        result.put("frozen", priorityGroups.get("FROZEN"));
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue-forecast")
    public ResponseEntity<Map<String, Object>> getRevenueForecast() {
        List<Deal> deals = dealRepository.findAll();
        
        double weightedPipeline = deals.stream()
            .filter(d -> !"CLOSED".equals(d.getStage()))
            .mapToDouble(d -> {
                double amount = d.getAmount() != null ? d.getAmount().doubleValue() : 0;
                int probability = d.getProbability() != null ? d.getProbability() : 0;
                return amount * (probability / 100.0);
            })
            .sum();
        
        Map<String, Object> forecast = new HashMap<>();
        forecast.put("weightedPipeline", weightedPipeline);
        forecast.put("bestCase", deals.stream()
            .filter(d -> !"CLOSED".equals(d.getStage()))
            .mapToDouble(d -> d.getAmount() != null ? d.getAmount().doubleValue() : 0)
            .sum());
        forecast.put("worstCase", deals.stream()
            .filter(d -> "QUALIFIED".equals(d.getStage()) || "CLOSED".equals(d.getStage()))
            .mapToDouble(d -> d.getAmount() != null ? d.getAmount().doubleValue() : 0)
            .sum());
        
        return ResponseEntity.ok(forecast);
    }

    @GetMapping("/performance")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics() {
        List<Lead> leads = leadRepository.findAll();
        List<Deal> deals = dealRepository.findAll();
        
        Map<String, Object> performance = new HashMap<>();
        
        // Average time to close (mock data for now)
        performance.put("avgTimeToClose", 45); // days
        performance.put("avgResponseTime", 2.5); // hours
        performance.put("followUpRate", 85); // percentage
        
        // Activity metrics
        performance.put("totalActivities", leads.size() + deals.size());
        performance.put("completedTasks", 0);
        performance.put("pendingTasks", 0);
        
        return ResponseEntity.ok(performance);
    }
}
