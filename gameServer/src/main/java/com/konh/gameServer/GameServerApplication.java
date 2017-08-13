package com.konh.gameServer;

import com.konh.gameServer.services.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GameServerApplication {

	@Bean
	UserService getUserService() {
		return new UserService();
	}

	public static void main(String[] args) {
		SpringApplication.run(GameServerApplication.class, args);
	}
}
