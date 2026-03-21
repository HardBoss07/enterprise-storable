package dev.m4tt3o.storable.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan("dev.m4tt3o.storable")
@EnableJpaRepositories("dev.m4tt3o.storable")
@ComponentScan("dev.m4tt3o.storable")
@EnableScheduling
public class StorableApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(StorableApiApplication.class, args);
    }
}
