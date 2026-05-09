package com.luisland.backend.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.connection.ConnectionPoolSettings;
import com.mongodb.connection.SocketSettings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import java.util.concurrent.TimeUnit;

/**
 * Configura el pool de conexiones de MongoDB de forma explícita,
 * sobreescribiendo la auto-configuración de Spring Boot.
 */
@Configuration
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    // Pool
    @Value("${mongodb.pool.min-size:2}")
    private int minSize;

    @Value("${mongodb.pool.max-size:10}")
    private int maxSize;

    @Value("${mongodb.pool.max-life-time-ms:1800000}")
    private long maxLifeTimeMs;

    @Value("${mongodb.pool.max-idle-time-ms:600000}")
    private long maxIdleTimeMs;

    @Value("${mongodb.pool.max-wait-time-ms:30000}")
    private long maxWaitTimeMs;

    @Value("${mongodb.pool.connect-timeout-ms:10000}")
    private long connectTimeoutMs;

    @Bean
    public MongoClientSettings mongoClientSettings() {

        ConnectionPoolSettings poolSettings = ConnectionPoolSettings.builder()
                .minSize(minSize)
                .maxSize(maxSize)
                .maxConnectionLifeTime(maxLifeTimeMs, TimeUnit.MILLISECONDS)
                .maxConnectionIdleTime(maxIdleTimeMs, TimeUnit.MILLISECONDS)
                .maxWaitTime(maxWaitTimeMs,            TimeUnit.MILLISECONDS)
                .build();

        SocketSettings socketSettings = SocketSettings.builder()
                .connectTimeout((int) connectTimeoutMs, TimeUnit.MILLISECONDS)
                .build();

        return MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(mongoUri))
                .applyToConnectionPoolSettings(builder -> builder.applySettings(poolSettings))
                .applyToSocketSettings(builder -> builder.applySettings(socketSettings))
                .build();
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClientSettings settings) {
        return new SimpleMongoClientDatabaseFactory(
                com.mongodb.client.MongoClients.create(settings),
                new ConnectionString(mongoUri).getDatabase()
        );
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory factory) {
        return new MongoTemplate(factory);
    }
}