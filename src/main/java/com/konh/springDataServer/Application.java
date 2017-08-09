package com.konh.springDataServer;

import com.konh.springDataServer.Models.User;
import com.konh.springDataServer.Services.UserService.IUserService;
import com.konh.springDataServer.Services.UserService.InMemoryUserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.*;

import java.util.ArrayList;

@Configuration
public class Application {

    @Bean
    IUserService userService() {
        return new InMemoryUserService();
    }

    public static void main(String[] args) {
        ApplicationContext context =
                new AnnotationConfigApplicationContext(Application.class);
        IUserService userService = context.getBean(IUserService.class);
        userService.add(new User(0, "test"));
        ArrayList<User> users = userService.getAll();
        for (User user : users) {
            System.out.println(user.toString());
        }
    }
}
