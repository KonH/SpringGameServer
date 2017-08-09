package com.konh.springDataServer.Services.UserService;

import com.konh.springDataServer.Models.User;

import java.util.ArrayList;
import java.util.Optional;

public interface IUserService {
    ArrayList<User> getAll();
    void add(User user);
    Optional<User> findById(int id);
    boolean tryRemove(int id);
}
