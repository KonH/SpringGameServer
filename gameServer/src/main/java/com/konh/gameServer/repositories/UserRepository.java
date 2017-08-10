package com.konh.gameServer.repositories;

import com.konh.gameServer.models.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> { }
