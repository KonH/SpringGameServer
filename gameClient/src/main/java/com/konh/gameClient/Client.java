package com.konh.gameClient;

import com.konh.gameClient.models.User;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Scanner;

public class Client {
	String serverUrl;
	RestTemplate template = new RestTemplate(new HttpComponentsClientHttpRequestFactory());

	public Client(String serverUrl) {
		this.serverUrl = serverUrl;
	}

	public void start() {
		if (isConnected()) {
			process();
		}
	}

	boolean isConnected() {
		URI checkUri = URI.create(serverUrl + "/users");
		try {
			template.getForEntity(checkUri, String.class);
			System.out.println("Is connected to server.");
			return true;
		} catch (Exception e) {
			System.out.println("Error while check connection: " + e.toString());
		}
		return false;
	}

	void process() {
		Scanner s = new Scanner(System.in);
		while (true) {
			String input = s.next();
			switch (input) {
				case "add":
					System.out.println("Name:");
					addUser(s.next());
					break;

				case "get":
					System.out.println("Id:");
					getUser(s.nextLong());
					break;

				case "delete":
					System.out.println("Id:");
					deleteUser(s.nextLong());
					break;

				case "update":
					System.out.println("Id:");
					Long id = s.nextLong();
					System.out.println("Name:");
					String name = s.next();
					updateUser(id, name);
					break;

				case "list":
					listUsers();
					break;

				default:
					return;
			}
		}
	}

	void addUser(String name) {
		User user = new User(0L, name);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<User> entity = new HttpEntity<>(user,headers);
		HttpStatus statusCode = template.postForEntity(serverUrl + "/users", entity, String.class).getStatusCode();
		System.out.println(statusCode);

	}

	void getUser(Long id) {
		String result = template.getForEntity(serverUrl + "/users/" + id.toString(), String.class).getBody();
		System.out.println(result);
	}

	void deleteUser(Long id) {
		template.delete(serverUrl + "/users/" + id.toString());
	}

	void updateUser(Long id, String name) {
		User user = new User(id, name);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<User> entity = new HttpEntity<>(user,headers);
		template.exchange(serverUrl + "/users", HttpMethod.PATCH, entity, Void.class);
	}

	void listUsers() {
		String result = template.getForEntity(serverUrl + "/users", String.class).getBody();
		System.out.println(result);
	}
}
