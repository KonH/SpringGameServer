package com.konh.gameServer.controllers;

import com.konh.gameServer.models.User;
import com.konh.gameServer.repositories.UserRepository;
import jdk.nashorn.internal.codegen.CompilerConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.concurrent.Callable;

@RestController
@RequestMapping("users")
public class UserController {

	@Autowired
	private UserRepository repository;

	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	Callable<Iterable<User>> getAll() {
		return () -> repository.findAll();
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	Callable<User> getOne(@RequestParam(name = "id") Long id) {
		return () -> repository.findOne(id);
	}

	@RequestMapping(method = RequestMethod.POST)
	Callable<ResponseEntity> add(@RequestBody User user) {
		return () -> {
			Long id = user.getId();
			repository.save(user);
			URI uri = new URI("users/" + id.toString());
			return ResponseEntity.created(uri).build();
		};
	}

	@RequestMapping(method = RequestMethod.DELETE)
	Callable<ResponseEntity> remove(@RequestParam(name = "id") Long id) {
		return () -> {
			repository.delete(id);
			return ResponseEntity.ok().build();
		};
	}
}
