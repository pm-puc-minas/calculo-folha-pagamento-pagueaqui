package com.example.hrpayroll.Service;

import com.example.hrpayroll.Model.UserModel;
import com.example.hrpayroll.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
        @Autowired
        private final UserRepository userRepository;

        public UserService(UserRepository userRepository) {
                this.userRepository = userRepository;
        }

        public UserModel create(UserModel userModel) {
                return userRepository.save(userModel);
        }

        public List<UserModel> list() {
                return userRepository.findAll();
        }

        public Optional<UserModel> findOneById(Long id) {
                return userRepository.findById(id);
        }

}
