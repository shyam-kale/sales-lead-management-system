package com.sales.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    @ConditionalOnProperty(name = "DATABASE_URL")
    public DataSource renderDataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        // Render provides URL in format: postgres://user:pass@host/db
        // We need: jdbc:postgresql://host:5432/db
        
        if (databaseUrl.startsWith("postgres://")) {
            // Extract parts from postgres://user:pass@host/db
            String withoutProtocol = databaseUrl.substring("postgres://".length());
            
            // Split by @
            String[] parts = withoutProtocol.split("@");
            String credentials = parts[0]; // user:pass
            String hostAndDb = parts[1]; // host/db
            
            String[] credParts = credentials.split(":");
            String username = credParts[0];
            String password = credParts[1];
            
            String[] hostDbParts = hostAndDb.split("/");
            String host = hostDbParts[0];
            String database = hostDbParts[1];
            
            // Build JDBC URL with explicit port
            String jdbcUrl = String.format("jdbc:postgresql://%s:5432/%s", host, database);
            
            return DataSourceBuilder
                    .create()
                    .url(jdbcUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        }
        
        // Fallback: assume it's already in JDBC format
        return DataSourceBuilder
                .create()
                .url(databaseUrl)
                .build();
    }
}
