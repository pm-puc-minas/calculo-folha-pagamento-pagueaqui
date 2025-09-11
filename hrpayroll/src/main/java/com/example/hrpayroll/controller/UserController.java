package com.example.hrpayroll.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.example.hrpayroll.Model.UserModel;
import com.example.hrpayroll.Service.UserService;
@RestController
public class UserController {
    @Autowired
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users/create")
    public UserModel createUser(@Valid @RequestBody UserModel userModel) {
        return userService.create(userModel);
    }

    @GetMapping("/users/{id}")
    public Optional<UserModel> getUser(@Valid @PathVariable Long id) {
        return userService.findOneById(id);
    }

    @GetMapping("/users")
    public Iterable<UserModel> listUsers() {
        return userService.list();
    }
}
