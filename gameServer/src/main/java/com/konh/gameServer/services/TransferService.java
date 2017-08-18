package com.konh.gameServer.services;

import com.konh.gameServer.exceptions.NotEnoughItemCount;
import com.konh.gameServer.models.Item;
import com.konh.gameServer.models.User;
import com.konh.gameServer.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class TransferService {

	@Autowired
	private UserService userService;

	Optional<Item> findItemByName(User user, String name) {
		return user.getItems().stream().
				filter(it -> it.getName().equals(name)).findFirst();
	}

	public void makeTransfer(Long fromId, Long toId, Item item) throws NotEnoughItemCount {
		if ((item == null) || (StringUtils.isNullOrEmpty(item.getName())) || (item.getCount() <= 0)) {
			throw new IllegalArgumentException();
		}
		Optional<User> fromUserOpt = userService.getOne(fromId);
		Optional<User> toUserOpt = userService.getOne(toId);
		if (!(fromUserOpt.isPresent() && toUserOpt.isPresent())) {
			throw new IllegalArgumentException();
		}

		User fromUser = fromUserOpt.get();
		Optional<Item> fromUserItemOpt = findItemByName(fromUser, item.getName());
		if (!fromUserItemOpt.isPresent() || (fromUserItemOpt.get().getCount() < item.getCount())) {
			throw new NotEnoughItemCount();
		}
		Item fromUserItem = fromUserItemOpt.get();
		fromUserItem.setCount(fromUserItem.getCount() - item.getCount());
		if (fromUserItem.getCount() <= 0) {
			fromUser.getItems().remove(fromUserItem);
		}
		userService.update(fromUser);

		User toUser = toUserOpt.get();
		Optional<Item> toUserItemOpt = findItemByName(toUser, item.getName());
		if (toUserItemOpt.isPresent()) {
			Item toUserItem = toUserItemOpt.get();
			toUserItem.setCount(toUserItem.getCount() + item.getCount());
		} else {
			toUser.getItems().add(item);
		}
		userService.update(toUser);
	}
}
