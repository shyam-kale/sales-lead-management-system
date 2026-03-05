package com.sales.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        // If DATABASE_URL is provided (from Render), convert it to JDBC format
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            databaseUrl = databaseUrl.replace("postgres://", "jdbc:postgresql://");
        } else if (databaseUrl != null && databaseUrl.startsWith("postgresql://")) {
            databaseUrl = "jdbc:" + databaseUrl;
        }
        
        // If no DATABASE_URL, use default from application.properties
        if (databaseUrl == null) {
            return DataSourceBuilder.create().build();
        }
        
        return DataSourceBuilder
                .create()
                .url(databaseUrl)
                .build();
    }
}
