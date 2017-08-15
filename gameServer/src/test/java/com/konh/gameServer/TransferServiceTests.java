package com.konh.gameServer;

import com.konh.gameServer.exceptions.NotEnoughItemCount;
import com.konh.gameServer.models.Item;
import com.konh.gameServer.models.User;
import com.konh.gameServer.services.TransferService;
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
public class TransferServiceTests {

	@Autowired
	UserService userService;

	@Autowired
	TransferService transferService;

	@Rule
	public final ExpectedException exception = ExpectedException.none();

	Long senderId;
	Long receiverId;

	@Before
	public void prepare() {
		Iterable<User> all = userService.getAll();
		for (User u : all) {
			userService.remove(u.getId());
		}
		List<Item> items = new ArrayList<Item>();
		items.add(new Item("item", 5));
		senderId = userService.add(new User("sender", items)).getId();
		receiverId = userService.add(new User("receiver")).getId();
	}

	@Test
	public void init() {
		assertNotNull(transferService);
	}

	@Test
	public void transferSimple() throws NotEnoughItemCount {
		transferService.makeTransfer(senderId, receiverId, new Item("item", 4));
	}
}
