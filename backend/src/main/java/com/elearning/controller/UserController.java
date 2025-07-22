package com.elearning.controller;

import com.elearning.model.User;
import com.elearning.repository.UserRepository;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        String email = user.getEmail().trim().toLowerCase();

        String role = user.getRole();
        if (role == null || role.trim().isEmpty()) {
            user.setRole("user");
        } else {
            user.setRole(role.trim().toLowerCase());
        }

        user.setEmail(email); // normalize email

        System.out.println("🔐 Trying to register user: " + email);

        if (userRepository.findByEmail(email) != null) {
            return ResponseEntity.status(400).body("User already exists.");
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        String email = loginData.getEmail().trim().toLowerCase();
        String password = loginData.getPassword();
        String role = loginData.getRole().trim().toLowerCase();

        System.out.println("🔑 Login attempt: " + email + " as " + role);

        User user = userRepository.findByEmailAndPasswordAndRole(email, password, role);

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid email, password or role.");
        }

        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

   
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found.");
        }

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(updatedUser.getPassword());
        }

        if (updatedUser.getProfileImage() != null) {
            user.setProfileImage(updatedUser.getProfileImage());
        }

        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

  
    @PutMapping("/uploadPhoto/{email}")
    public ResponseEntity<?> uploadPhoto(@PathVariable String email, @RequestBody String imageUrl) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        user.setProfileImage(imageUrl.replace("\"", "")); 
        userRepository.save(user);
        return ResponseEntity.ok("Profile photo updated successfully");
    }
}
