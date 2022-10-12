package org.ergemp.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication

@ComponentScan(basePackages =   "org.ergemp.controller, org.ergemp.component, org.ergemp.model")

public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
