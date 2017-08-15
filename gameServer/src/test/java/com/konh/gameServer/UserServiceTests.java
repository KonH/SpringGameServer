package com.konh.gameServer;

import com.konh.gameServer.models.Item;
import com.konh.gameServer.models.User;
import com.konh.gameServer.services.UserService;
import com.konh.gameServer.utils.StreamConverter;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTests {

	@Autowired
	UserService userService;

	@Rule
	public final ExpectedException exception = ExpectedException.none();

	@Before
	public void prepare() {
		Iterable<User> all = userService.getAll();
		for (User u : all) {
			userService.remove(u.getId());
		}
	}

	@Test
	public void init() {
		assertNotNull(userService);
	}

	@Test
	public void addSimple() {
		User user = new User();
		String userName = "testUserName";
		user.setName(userName);
		User savedUser = userService.add(user);

		assertNotNull(savedUser);
		assertTrue(savedUser.getName() == userName);
		assertTrue(StreamConverter.streamOf(userService.getAll()).
				anyMatch(u -> u.getName() == userName));
	}

	@Test
	public void addBadName() {
		User user = new User("");

		exception.expect(IllegalArgumentException.class);
		userService.add(user);
	}

	@Test
	public void addNullItems() {
		User user = new User("user");
		user.setItems(null);

		exception.expect(IllegalArgumentException.class);
		userService.add(user);
	}

	@Test
	public void addbadItemName() {
		User user = new User("user");
		user.getItems().add(new Item("", 10));

		exception.expect(IllegalArgumentException.class);
		userService.add(user);
	}

	@Test
	public void addBadItemCount() {
		User user = new User("user");
		user.getItems().add(new Item("item", -1));

		exception.expect(IllegalArgumentException.class);
		userService.add(user);
	}

	@Test
	public void addDuplicatedItems() {
		User user = new User("user");
		user.getItems().add(new Item("item", 1));
		user.getItems().add(new Item("item", 2));

		exception.expect(IllegalArgumentException.class);
		userService.add(user);
	}

	@Test
	public void getById() {
		User user = new User("user");
		Long id = userService.add(user).getId();

		assertTrue(userService.getOne(id).isPresent());
	}

	@Test
	public void getByWrongId() {
		assertFalse(userService.getOne(-1L).isPresent());
	}

	@Test
	public void removeSimple() {
		User user = new User("user");
		User savedUser = userService.add(user);
		userService.remove(savedUser.getId());

		assertFalse(userService.getOne(savedUser.getId()).isPresent());
	}

	@Test
	public void removeNotExist() {
		exception.expect(IllegalArgumentException.class);
		userService.remove(-1L);
	}

	@Test
	public void updateName() {
		User user = new User("user");
		User savedUser = userService.add(user);
		User userToUpdate = new User(savedUser.getId(), "anotherName");
		userService.update(userToUpdate);

		assertSame(
				userService.getOne(savedUser.getId()).get().getName(),
				userToUpdate.getName());
	}

	@Test
	public void updateItems() {
		User user = new User("user");
		User savedUser = userService.add(user);
		List<Item> items = new ArrayList<>();
		items.add(new Item("test", 10));
		User userToUpdate = new User(savedUser.getId(), user.getName(), items);
		userService.update(userToUpdate);

		assertSame(
				userService.getOne(savedUser.getId()).get().getItems().size(),
				userToUpdate.getItems().size());
	}

	@Test
	public void updateNull() {
		User user = null;

		exception.expect(IllegalArgumentException.class);
		userService.update(user);
	}

	@Test
	public void updateNotExist() {
		User user = new User(-1L, "name");

		exception.expect(IllegalArgumentException.class);
		userService.update(user);
	}

	@Test
	public void updateIdNotChanged() {
		User user = new User("user");
		User savedUser = userService.add(user);
		User userToUpdate = new User(savedUser.getId(), savedUser.getName());
		userService.update(userToUpdate);

		assertTrue(userService.getOne(savedUser.getId()).isPresent());
	}
}
