package com.sales;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;

    public ActivityController(ActivityRepository activityRepository, UserRepository userRepository,
                            LeadRepository leadRepository, DealRepository dealRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
    }

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        return activityRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        // Set default user if not provided
        if (activity.getUser() == null) {
            userRepository.findById(1L).ifPresent(activity::setUser);
        }
        Activity savedActivity = activityRepository.save(activity);
        return ResponseEntity.ok(savedActivity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        if (!activityRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        activityRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<Activity>> getActivitiesByLead(@PathVariable Long leadId) {
        return ResponseEntity.ok(activityRepository.findByLeadIdOrderByActivityDateDesc(leadId));
    }

    @GetMapping("/deal/{dealId}")
    public ResponseEntity<List<Activity>> getActivitiesByDeal(@PathVariable Long dealId) {
        return ResponseEntity.ok(activityRepository.findByDealIdOrderByActivityDateDesc(dealId));
    }
}
