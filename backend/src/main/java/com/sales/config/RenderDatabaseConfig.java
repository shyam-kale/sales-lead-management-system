package com.sales.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class RenderDatabaseConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        
        // Get DATABASE_URL from environment
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            // Parse postgres://user:pass@host:port/db
            String url = databaseUrl.substring("postgres://".length());
            String[] parts = url.split("@");
            
            if (parts.length == 2) {
                String[] creds = parts[0].split(":");
                String username = creds[0];
                String password = creds.length > 1 ? creds[1] : "";
                
                String[] hostDb = parts[1].split("/");
                String hostPort = hostDb[0];
                String database = hostDb.length > 1 ? hostDb[1] : "";
                
                // Build JDBC URL
                String jdbcUrl = "jdbc:postgresql://" + hostPort + "/" + database;
                
                properties.setUrl(jdbcUrl);
                properties.setUsername(username);
                properties.setPassword(password);
                properties.setDriverClassName("org.postgresql.Driver");
            }
        }
        
        return properties;
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
