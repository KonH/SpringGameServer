package com.konh.springDataServer.Services.UserService;

import com.konh.springDataServer.Models.User;

import java.util.ArrayList;
import java.util.Optional;

public class InMemoryUserService implements IUserService {
    private ArrayList<User> users;

    private InMemoryUserService(ArrayList<User> users) {
        this.users = new ArrayList<>();
        if (users != null) {
            this.users.addAll(users);
        }
    }

    public InMemoryUserService() {
        this(null);
    }

    public ArrayList<User> getAll() {
        return users;
    }

    public void add(User user) {
        users.add(user);
    }

    public Optional<User> findById(int id) {
        return users.stream().filter(u -> u.getId() == id).findFirst();
    }

    public boolean tryRemove(int id) {
        Optional<User> user = findById(id);
        if (user.isPresent()) {
            users.remove(user.get());
            return true;
        }
        return false;
    }
}
