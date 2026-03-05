package com.sales;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;

    public DataLoader(LeadRepository leadRepository, DealRepository dealRepository,
                     TaskRepository taskRepository, ActivityRepository activityRepository) {
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.taskRepository = taskRepository;
        this.activityRepository = activityRepository;
    }

    @Override
    public void run(String... args) {
        // Only load data if database is empty
        if (leadRepository.count() > 0) {
            return;
        }

        // Create sample leads
        Lead lead1 = new Lead();
        lead1.setName("Priya Deshmukh");
        lead1.setEmail("priya.deshmukh@techcorp.in");
        lead1.setPhone("+91-9876543210");
        lead1.setCompany("TechCorp India");
        lead1.setStatus("NEW");
        lead1.setSource("WEBSITE");
        lead1.setScore(85);
        leadRepository.save(lead1);

        Lead lead2 = new Lead();
        lead2.setName("Rahul Patil");
        lead2.setEmail("rahul.patil@innovate.in");
        lead2.setPhone("+91-9876543211");
        lead2.setCompany("Innovate Solutions");
        lead2.setStatus("CONTACTED");
        lead2.setSource("REFERRAL");
        lead2.setScore(92);
        leadRepository.save(lead2);

        Lead lead3 = new Lead();
        lead3.setName("Sneha Kulkarni");
        lead3.setEmail("sneha.kulkarni@datatech.in");
        lead3.setPhone("+91-9876543212");
        lead3.setCompany("DataTech Systems");
        lead3.setStatus("QUALIFIED");
        lead3.setSource("LINKEDIN");
        lead3.setScore(78);
        leadRepository.save(lead3);

        // Create sample deals
        Deal deal1 = new Deal();
        deal1.setTitle("Enterprise Software License");
        deal1.setAmount(new BigDecimal("500000"));
        deal1.setStage("NEGOTIATION");
        deal1.setLead(lead2);
        deal1.setExpectedCloseDate(LocalDate.now().plusDays(30));
        dealRepository.save(deal1);

        Deal deal2 = new Deal();
        deal2.setTitle("Cloud Migration Project");
        deal2.setAmount(new BigDecimal("750000"));
        deal2.setStage("PROPOSAL");
        deal2.setLead(lead3);
        deal2.setExpectedCloseDate(LocalDate.now().plusDays(45));
        dealRepository.save(deal2);

        // Create sample tasks
        Task task1 = new Task();
        task1.setTitle("Follow up with Priya Deshmukh");
        task1.setDescription("Discuss product demo and pricing");
        task1.setPriority("HIGH");
        task1.setStatus("PENDING");
        task1.setDueDate(LocalDateTime.now().plusDays(2));
        task1.setLead(lead1);
        taskRepository.save(task1);

        Task task2 = new Task();
        task2.setTitle("Send proposal to Rahul Patil");
        task2.setDescription("Prepare and send detailed proposal");
        task2.setPriority("URGENT");
        task2.setStatus("IN_PROGRESS");
        task2.setDueDate(LocalDateTime.now().plusDays(1));
        task2.setLead(lead2);
        task2.setDeal(deal1);
        taskRepository.save(task2);

        // Create sample activities
        Activity activity1 = new Activity();
        activity1.setActivityType("EMAIL");
        activity1.setTitle("Initial Contact");
        activity1.setDescription("Sent initial email to Priya Deshmukh");
        activity1.setLead(lead1);
        activity1.setActivityDate(LocalDateTime.now().minusDays(1));
        activityRepository.save(activity1);

        Activity activity2 = new Activity();
        activity2.setActivityType("CALL");
        activity2.setTitle("Requirements Discussion");
        activity2.setDescription("Phone call with Rahul Patil - discussed requirements");
        activity2.setLead(lead2);
        activity2.setActivityDate(LocalDateTime.now().minusHours(3));
        activityRepository.save(activity2);

        System.out.println("✅ Sample data loaded successfully!");
    }
}
