package com.konh.gameServer.controllers;

import com.konh.gameServer.models.Item;
import com.konh.gameServer.models.User;
import com.konh.gameServer.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.concurrent.Callable;

@RestController
@RequestMapping("users")
public class UserController {

	@Autowired
	private UserRepository repository;

	void logUserState(String message, User user) {
		System.out.println();
		System.out.println(message + ":");
		System.out.println(user.toString());
		System.out.println();
	}

	@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	Callable<Iterable<User>> getAll() {
		return () -> repository.findAll();
	}

	@GetMapping(value = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	Callable<ResponseEntity<User>> getOne(@PathVariable Long id) {
		return () -> {
			User user = repository.findOne(id);
			if (user != null) {
				return ResponseEntity.ok().body(user);
			}
			return ResponseEntity.notFound().build();
		};
	}

	@PostMapping()
	Callable<ResponseEntity> add(@RequestBody User user) {
		return () -> {
			if (user == null) {
				return ResponseEntity.badRequest().build();
			}
			logUserState("User to add", user);
			User savedUser = repository.save(user);
			logUserState("Saved user", savedUser);
			Long id = savedUser.getId();
			URI uri = new URI("users/" + id.toString());

			return ResponseEntity.created(uri).build();
		};
	}

	@DeleteMapping(value = "{id}")
	Callable<ResponseEntity> remove(@PathVariable Long id) {
		return () -> {
			if (!repository.exists(id)) {
				return ResponseEntity.notFound().build();
			}
			repository.delete(id);
			return ResponseEntity.ok().build();
		};
	}

	void updateUserItems(User user, List<Item> items) {
		user.getItems().clear();
		user.getItems().addAll(items);
	}

	@PatchMapping()
	Callable<ResponseEntity> update(@RequestBody User user) {
		return () -> {
			if (user == null) {
				return ResponseEntity.badRequest().build();
			}
			if (!repository.exists(user.getId())) {
				return ResponseEntity.notFound().build();
			}
			logUserState("User to update", user);
			User localUser = repository.findOne(user.getId());
			logUserState("User in repository", localUser);
			localUser.setName(user.getName());
			updateUserItems(localUser, user.getItems());
			User savedUser = repository.save(localUser);
			logUserState("Updated user", savedUser);
			return ResponseEntity.ok().build();
		};
	}
}
