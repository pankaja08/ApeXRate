package com.apexrate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ApexRateApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApexRateApplication.class, args);
    }

}
