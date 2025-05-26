package com.example.registry_1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class Registry1Application {

    public static void main(String[] args) {
        SpringApplication.run(Registry1Application.class, args);
    }

}
