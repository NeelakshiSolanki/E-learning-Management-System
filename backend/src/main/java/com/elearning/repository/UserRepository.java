package com.elearning.repository;

import com.elearning.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findByEmailAndPasswordAndRole(String email, String password, String role);
    
}
