package com.fittrack.fittrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.fittrack", "controller", "service", "repository", "security", "auth", "config"})
@EntityScan(basePackages = {"entity"})
@EnableJpaRepositories(basePackages = {"repository"})
public class FittrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(FittrackApplication.class, args);
	}

}

