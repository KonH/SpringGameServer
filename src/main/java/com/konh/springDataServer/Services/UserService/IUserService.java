package com.konh.springDataServer.Services.UserService;

import com.konh.springDataServer.Models.User;

import java.util.ArrayList;

public interface IUserService {
    ArrayList<User> getAll();
    void add(User user);
}
