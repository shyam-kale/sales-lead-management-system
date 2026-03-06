package com.sales.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class RenderDatabaseConfig {

    private final Environment env;

    public RenderDatabaseConfig(Environment env) {
        this.env = env;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = env.getProperty("DATABASE_URL");
        
        HikariDataSource dataSource = new HikariDataSource();
        
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
                
                dataSource.setJdbcUrl(jdbcUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);
                dataSource.setDriverClassName("org.postgresql.Driver");
            }
        } else {
            // Use default MySQL configuration
            dataSource.setJdbcUrl(env.getProperty("spring.datasource.url", "jdbc:mysql://localhost:3306/sales_lead_db"));
            dataSource.setUsername(env.getProperty("spring.datasource.username", "root"));
            dataSource.setPassword(env.getProperty("spring.datasource.password", "Root@1234"));
            dataSource.setDriverClassName(env.getProperty("spring.datasource.driver-class-name", "com.mysql.cj.jdbc.Driver"));
        }
        
        // Connection pool settings
        dataSource.setMaximumPoolSize(5);
        dataSource.setMinimumIdle(2);
        dataSource.setConnectionTimeout(20000);
        dataSource.setIdleTimeout(300000);
        dataSource.setMaxLifetime(600000);
        
        return dataSource;
    }
}
