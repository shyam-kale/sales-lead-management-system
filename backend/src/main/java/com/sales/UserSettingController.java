package com.sales;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class UserSettingController {

    @Autowired
    private UserSettingRepository userSettingRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all user settings
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserSettings() {
        Long userId = 1L; // Default user for demo
        List<UserSetting> settings = userSettingRepository.findByUserId(userId);
        
        Map<String, Object> settingsMap = new HashMap<>();
        
        // Convert to key-value map
        for (UserSetting setting : settings) {
            Object value = convertSettingValue(setting.getSettingValue(), setting.getSettingType());
            settingsMap.put(setting.getSettingKey(), value);
        }
        
        // Add default settings if not present
        if (settingsMap.isEmpty()) {
            settingsMap = getDefaultSettings();
            saveDefaultSettings(userId, settingsMap);
        }
        
        return ResponseEntity.ok(settingsMap);
    }

    // Update user settings
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateUserSettings(@RequestBody Map<String, Object> settingsData) {
        Long userId = 1L; // Default user for demo
        Optional<User> user = userRepository.findById(userId);
        
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        // Update each setting
        for (Map.Entry<String, Object> entry : settingsData.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            String stringValue = value != null ? value.toString() : "";
            String type = determineSettingType(value);
            
            Optional<UserSetting> existingSetting = userSettingRepository.findByUserIdAndSettingKey(userId, key);
            
            if (existingSetting.isPresent()) {
                UserSetting setting = existingSetting.get();
                setting.setSettingValue(stringValue);
                setting.setSettingType(type);
                userSettingRepository.save(setting);
            } else {
                UserSetting newSetting = new UserSetting(user.get(), key, stringValue, type);
                userSettingRepository.save(newSetting);
            }
        }
        
        return getUserSettings();
    }

    // Get specific setting
    @GetMapping("/{key}")
    public ResponseEntity<Object> getUserSetting(@PathVariable String key) {
        Long userId = 1L; // Default user for demo
        Optional<UserSetting> setting = userSettingRepository.findByUserIdAndSettingKey(userId, key);
        
        if (setting.isPresent()) {
            Object value = convertSettingValue(setting.get().getSettingValue(), setting.get().getSettingType());
            return ResponseEntity.ok(value);
        }
        
        return ResponseEntity.notFound().build();
    }

    // Update specific setting
    @PutMapping("/{key}")
    public ResponseEntity<Object> updateUserSetting(@PathVariable String key, @RequestBody Map<String, Object> data) {
        Long userId = 1L; // Default user for demo
        Optional<User> user = userRepository.findById(userId);
        
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Object value = data.get("value");
        String stringValue = value != null ? value.toString() : "";
        String type = determineSettingType(value);
        
        Optional<UserSetting> existingSetting = userSettingRepository.findByUserIdAndSettingKey(userId, key);
        
        if (existingSetting.isPresent()) {
            UserSetting setting = existingSetting.get();
            setting.setSettingValue(stringValue);
            setting.setSettingType(type);
            userSettingRepository.save(setting);
        } else {
            UserSetting newSetting = new UserSetting(user.get(), key, stringValue, type);
            userSettingRepository.save(newSetting);
        }
        
        Object convertedValue = convertSettingValue(stringValue, type);
        return ResponseEntity.ok(convertedValue);
    }

    // Helper methods
    private Object convertSettingValue(String value, String type) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        
        switch (type.toLowerCase()) {
            case "boolean":
                return Boolean.parseBoolean(value);
            case "integer":
                try {
                    return Integer.parseInt(value);
                } catch (NumberFormatException e) {
                    return 0;
                }
            case "double":
                try {
                    return Double.parseDouble(value);
                } catch (NumberFormatException e) {
                    return 0.0;
                }
            case "json":
                return value; // Return as string, frontend can parse
            default:
                return value;
        }
    }
    
    private String determineSettingType(Object value) {
        if (value instanceof Boolean) return "boolean";
        if (value instanceof Integer) return "integer";
        if (value instanceof Double || value instanceof Float) return "double";
        if (value instanceof String) {
            String str = (String) value;
            if (str.startsWith("[") || str.startsWith("{")) return "json";
        }
        return "string";
    }
    
    private Map<String, Object> getDefaultSettings() {
        Map<String, Object> defaults = new HashMap<>();
        
        // General Settings
        defaults.put("appName", "Sales Lead Management System");
        defaults.put("theme", "light");
        defaults.put("language", "en");
        defaults.put("timezone", "UTC");
        defaults.put("defaultView", "dashboard");
        defaults.put("refreshInterval", 30);
        defaults.put("showNotifications", true);
        defaults.put("autoSave", true);
        
        // Lead Settings
        defaults.put("leadStatuses", "[\"NEW\",\"CONTACTED\",\"QUALIFIED\"]");
        defaults.put("defaultLeadStatus", "NEW");
        defaults.put("leadAutoAssign", false);
        defaults.put("leadNotifications", true);
        
        // Deal Settings
        defaults.put("dealStages", "[\"NEW\",\"PROPOSAL\",\"QUALIFIED\",\"CLOSED\"]");
        defaults.put("defaultDealStage", "NEW");
        defaults.put("dealAutoAssign", false);
        defaults.put("dealNotifications", true);
        
        return defaults;
    }
    
    private void saveDefaultSettings(Long userId, Map<String, Object> settings) {
        if (userId == null) return;
        
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            for (Map.Entry<String, Object> entry : settings.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                String stringValue = value != null ? value.toString() : "";
                String type = determineSettingType(value);
                
                try {
                    UserSetting setting = new UserSetting(user.get(), key, stringValue, type);
                    userSettingRepository.save(setting);
                } catch (Exception e) {
                    // Log error but continue with other settings
                    System.err.println("Failed to save setting " + key + ": " + e.getMessage());
                }
            }
        }
    }
}