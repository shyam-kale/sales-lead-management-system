package com.sales;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    // Get user profile (for now, we'll use userId = 1 as default)
    @GetMapping
    public ResponseEntity<UserProfile> getUserProfile() {
        Long userId = 1L; // Default user for demo
        try {
            Optional<UserProfile> profile = userProfileRepository.findByUserId(userId);
            
            if (profile.isPresent()) {
                return ResponseEntity.ok(profile.get());
            } else {
                // Create default profile if not exists
                Optional<User> user = userRepository.findById(userId);
                if (user.isPresent()) {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUser(user.get());
                    newProfile.setFirstName("John");
                    newProfile.setLastName("Doe");
                    newProfile.setTitle("Sales Manager");
                    newProfile.setDepartment("Sales");
                    newProfile.setLocation("New York, NY");
                    newProfile.setBio("Experienced sales professional with 5+ years in lead management and customer acquisition.");
                    newProfile.setWorkingDays("[\"Monday\",\"Tuesday\",\"Wednesday\",\"Thursday\",\"Friday\"]");
                    
                    UserProfile savedProfile = userProfileRepository.save(newProfile);
                    return ResponseEntity.ok(savedProfile);
                }
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
        
        return ResponseEntity.notFound().build();
    }

    // Update user profile
    @PutMapping
    public ResponseEntity<UserProfile> updateUserProfile(@RequestBody UserProfile profileData) {
        Long userId = 1L; // Default user for demo
        Optional<UserProfile> existingProfile = userProfileRepository.findByUserId(userId);
        
        if (existingProfile.isPresent()) {
            UserProfile profile = existingProfile.get();
            
            // Update fields
            if (profileData.getFirstName() != null) profile.setFirstName(profileData.getFirstName());
            if (profileData.getLastName() != null) profile.setLastName(profileData.getLastName());
            if (profileData.getPhone() != null) profile.setPhone(profileData.getPhone());
            if (profileData.getTitle() != null) profile.setTitle(profileData.getTitle());
            if (profileData.getDepartment() != null) profile.setDepartment(profileData.getDepartment());
            if (profileData.getLocation() != null) profile.setLocation(profileData.getLocation());
            if (profileData.getBio() != null) profile.setBio(profileData.getBio());
            if (profileData.getAvatarUrl() != null) profile.setAvatarUrl(profileData.getAvatarUrl());
            
            // Update preferences
            if (profileData.getEmailNotifications() != null) profile.setEmailNotifications(profileData.getEmailNotifications());
            if (profileData.getPushNotifications() != null) profile.setPushNotifications(profileData.getPushNotifications());
            if (profileData.getWeeklyReports() != null) profile.setWeeklyReports(profileData.getWeeklyReports());
            if (profileData.getMarketingEmails() != null) profile.setMarketingEmails(profileData.getMarketingEmails());
            
            // Update working hours
            if (profileData.getWorkingHoursStart() != null) profile.setWorkingHoursStart(profileData.getWorkingHoursStart());
            if (profileData.getWorkingHoursEnd() != null) profile.setWorkingHoursEnd(profileData.getWorkingHoursEnd());
            if (profileData.getTimezone() != null) profile.setTimezone(profileData.getTimezone());
            if (profileData.getWorkingDays() != null) profile.setWorkingDays(profileData.getWorkingDays());
            
            try {
                UserProfile savedProfile = userProfileRepository.save(profile);
                if (savedProfile != null) {
                    return ResponseEntity.ok(savedProfile);
                } else {
                    return ResponseEntity.internalServerError().build();
                }
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    // Update login tracking
    @PostMapping("/login")
    public ResponseEntity<Void> updateLoginTracking() {
        Long userId = 1L; // Default user for demo
        Optional<UserProfile> profile = userProfileRepository.findByUserId(userId);
        
        if (profile.isPresent()) {
            UserProfile userProfile = profile.get();
            userProfile.setLastLogin(LocalDateTime.now());
            userProfile.setTotalLogins(userProfile.getTotalLogins() + 1);
            userProfileRepository.save(userProfile);
            return ResponseEntity.ok().build();
        }
        
        return ResponseEntity.notFound().build();
    }
}