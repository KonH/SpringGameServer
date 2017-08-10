package com.konh.gameClient;

public class Main {

	static String serverUrl = "http://127.0.0.1:8080";

	public static void main(String[] args) {
		System.out.println("Spring Game Server Client");
		Client client = new Client(serverUrl);
		client.start();
	}
}
