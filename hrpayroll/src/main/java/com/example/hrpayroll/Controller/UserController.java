package com.example.hrpayroll.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.hrpayroll.Model.UserModel;
import com.example.hrpayroll.Service.UserService;
@RestController
public class UserController {
    @Autowired
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/user/create")
    public UserModel createUser(@RequestBody UserModel userModel) {
        return userService.create(userModel);
    }

    @GetMapping("/user/{id}")
    public Optional<UserModel> getUser(@PathVariable String id) {
        return userService.findOneById(id);
    }

    @GetMapping("/users")
    public Iterable<UserModel> listUsers() {
        return userService.list();
    }

    @GetMapping("/users/health")
    public String healthCheck() {
        return "OK";
    }
}
