package com.sales.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:}")
    private String defaultUrl;

    @Value("${spring.datasource.username:}")
    private String defaultUsername;

    @Value("${spring.datasource.password:}")
    private String defaultPassword;

    @Value("${spring.datasource.driver-class-name:}")
    private String defaultDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        // If DATABASE_URL is provided (from Render), convert it to JDBC format
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            if (databaseUrl.startsWith("postgres://")) {
                databaseUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
            } else if (databaseUrl.startsWith("postgresql://")) {
                databaseUrl = "jdbc:" + databaseUrl;
            }
            
            return DataSourceBuilder
                    .create()
                    .url(databaseUrl)
                    .build();
        }
        
        // Use application.properties values
        if (defaultUrl != null && !defaultUrl.isEmpty()) {
            DataSourceBuilder<?> builder = DataSourceBuilder.create()
                    .url(defaultUrl);
            
            if (defaultUsername != null && !defaultUsername.isEmpty()) {
                builder.username(defaultUsername);
            }
            if (defaultPassword != null && !defaultPassword.isEmpty()) {
                builder.password(defaultPassword);
            }
            if (defaultDriver != null && !defaultDriver.isEmpty()) {
                builder.driverClassName(defaultDriver);
            }
            
            return builder.build();
        }
        
        // Fallback to default Spring Boot behavior
        return DataSourceBuilder.create().build();
    }
}
