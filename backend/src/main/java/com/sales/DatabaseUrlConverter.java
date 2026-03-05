package com.sales;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DatabaseUrlConverter implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        String databaseUrl = environment.getProperty("DATABASE_URL");
        
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            // Convert postgres:// to jdbc:postgresql://
            String jdbcUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            
            // Extract credentials and host from URL
            // Format: postgres://user:pass@host:port/db
            String withoutProtocol = databaseUrl.substring("postgres://".length());
            String[] parts = withoutProtocol.split("@");
            
            if (parts.length == 2) {
                String[] credentials = parts[0].split(":");
                String username = credentials[0];
                String password = credentials.length > 1 ? credentials[1] : "";
                
                // Add converted properties
                Map<String, Object> props = new HashMap<>();
                props.put("spring.datasource.url", jdbcUrl);
                props.put("spring.datasource.username", username);
                props.put("spring.datasource.password", password);
                
                environment.getPropertySources().addFirst(new MapPropertySource("renderDatabase", props));
            }
        }
    }
}
