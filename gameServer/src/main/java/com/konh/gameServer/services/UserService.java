package com.konh.gameServer.services;

import com.konh.gameServer.models.Item;
import com.konh.gameServer.models.User;
import com.konh.gameServer.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

public class UserService {

	@Autowired
	private UserRepository repository;

	void logUserState(String message, User user) {
		System.out.println();
		System.out.println(message + ":");
		System.out.println(user.toString());
		System.out.println();
	}

	boolean isValidString(String string) {
		return (string != null) && !string.isEmpty();
	}

	boolean isValidUser(User user) {
		if (!isValidString(user.getName())) {
			return false;
		}
		List<Item> items = user.getItems();
		if (items == null) {
			return false;
		}
		HashSet<String> nameUsages = new HashSet<>();
		for (Item item : items) {
			if (item == null) {
				return false;
			}
			if (!isValidString(item.getName())) {
				return false;
			}
			if (nameUsages.contains(item.getName())) {
				return false;
			}
			if (item.getCount() <= 0) {
				return false;
			}
			nameUsages.add(item.getName());
		}
		return true;
	}

	public Iterable<User> getAll() {
		return repository.findAll();
	}

	public Optional<User> getOne(Long id) {
		User user = (id != null) ? repository.findOne(id) : null;
		return Optional.ofNullable(user);
	}

	public User add(User user) throws IllegalArgumentException {
		if (user == null) {
			throw new IllegalArgumentException("User can not be null!");
		}
		logUserState("User to add", user);
		if (!isValidUser(user)) {
			throw new IllegalArgumentException("User is invalid!");
		}
		User savedUser = repository.save(user);
		logUserState("Saved user", savedUser);
		return savedUser;
	}

	public void remove(Long id) throws IllegalArgumentException {
		if (!repository.exists(id)) {
			throw new IllegalArgumentException("User is not exist!");
		}
		repository.delete(id);
	}

	void updateUserItems(User user, List<Item> items) {
		user.getItems().clear();
		user.getItems().addAll(items);
	}

	public void update(User user) throws IllegalArgumentException {
		if (user == null) {
			throw new IllegalArgumentException("User can not be null!");
		}
		if (!repository.exists(user.getId())) {
			throw new IllegalArgumentException("User is not exist!");
		}
		logUserState("User to update", user);
		if (!isValidUser(user)) {
			throw new IllegalArgumentException("User is invalid!");
		}
		User localUser = repository.findOne(user.getId());
		logUserState("User in repository", localUser);
		localUser.setName(user.getName());
		updateUserItems(localUser, user.getItems());
		User savedUser = repository.save(localUser);
		logUserState("Updated user", savedUser);
	}
}
