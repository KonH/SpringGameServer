package com.konh.gameServer;

import com.konh.gameServer.models.User;
import com.konh.gameServer.services.UserService;
import com.konh.gameServer.utils.StreamConverter;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTests {

	@Autowired
	private Environment environment;

	@Autowired
	UserService userService;

	@Before
	public void clean() {
		Iterable<User> all = userService.getAll();
		for (User u : all) {
			userService.remove(u.getId());
		}
	}

	@Test
	public void initTest() {
		assertNotNull(userService);
	}

	@Test
	public void simpleAddUser() {
		User user = new User();
		String userName = "testUserName";
		user.setName(userName);
		User savedUser = userService.add(user);

		assertNotNull(savedUser);
		assertTrue(user.getName() == userName);
		StreamConverter.streamOf(userService.getAll()).anyMatch(u -> u.getName() == userName);
	}
}
