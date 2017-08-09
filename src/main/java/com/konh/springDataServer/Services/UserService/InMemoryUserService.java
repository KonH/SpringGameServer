package com.konh.springDataServer.Services.UserService;

import com.konh.springDataServer.Models.User;

import java.util.ArrayList;

public class InMemoryUserService implements IUserService {
    private ArrayList<User> users;

    public InMemoryUserService(ArrayList<User> users) {
        this.users = new ArrayList<User>();
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
}
