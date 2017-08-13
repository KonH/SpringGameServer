package com.konh.gameServer.controllers;

import com.konh.gameServer.models.Item;
import com.konh.gameServer.models.User;
import com.konh.gameServer.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Callable;

@RestController
@RequestMapping("users")
public class UserController {

	@Autowired
	private UserService service;

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	Callable<Iterable<User>> getAll() {
		return () -> service.getAll();
	}

	@GetMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	Callable<ResponseEntity<User>> getOne(@PathVariable Long id) {
		return () -> {
			Optional<User> user = service.getOne(id);
			if (user.isPresent()) {
				return ResponseEntity.ok().body(user.get());
			}
			return ResponseEntity.notFound().build();
		};
	}

	@PostMapping()
	Callable<ResponseEntity> add(@RequestBody User user) {
		return () -> {
			try {
				User savedUser = service.add(user);
				Long id = savedUser.getId();
				URI uri = new URI("users/" + id.toString());
				return ResponseEntity.created(uri).build();
			} catch (Exception e) {
				return ResponseEntity.badRequest().body(e.toString());
			}
		};
	}

	@DeleteMapping(value = "{id}")
	Callable<ResponseEntity> remove(@PathVariable Long id) {
		return () -> {
			try {
				service.remove(id);
				return ResponseEntity.ok().build();
			} catch (Exception e) {
				return ResponseEntity.badRequest().body(e.toString());
			}
		};
	}

	void updateUserItems(User user, List<Item> items) {
		user.getItems().clear();
		user.getItems().addAll(items);
	}

	@PatchMapping()
	Callable<ResponseEntity> update(@RequestBody User user) {
		return () -> {
			try {
				service.update(user);
				return ResponseEntity.ok().build();
			} catch (Exception e) {
				return ResponseEntity.badRequest().body(e.toString());
			}
		};
	}
}
