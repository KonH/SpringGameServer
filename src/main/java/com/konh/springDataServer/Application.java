package com.konh.springDataServer;

import com.konh.springDataServer.Services.UserService.IUserService;
import com.konh.springDataServer.Services.UserService.InMemoryUserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.*;

@SpringBootApplication
public class Application {

    @Bean
    IUserService userService() {
        return new InMemoryUserService();
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
