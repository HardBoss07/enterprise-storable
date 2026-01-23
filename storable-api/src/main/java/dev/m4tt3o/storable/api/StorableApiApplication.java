package dev.m4tt3o.storable.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("dev.m4tt3o.storable.data.entity")
@EnableJpaRepositories("dev.m4tt3o.storable.data.repository")
public class StorableApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(StorableApiApplication.class, args);
    }
}
