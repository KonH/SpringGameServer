package com.konh.springDataServer;

import com.konh.springDataServer.Models.User;
import com.konh.springDataServer.Services.UserService.IUserService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.Callable;

@RestController
@RequestMapping("/users")
public class UserController {
    private IUserService service;

    public UserController(IUserService service) {
        this.service = service;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Callable<User> get(@RequestParam("id") int id) {
        System.out.println("Request user with id " + id);
        service.add(new User(id, "test"));
        return service.findById(id)::get;
    }
}
