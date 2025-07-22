package com.elearning.controller;
import org.springframework.ui.Model;

import com.elearning.model.Course;
import com.elearning.model.User;
import com.elearning.repository.CourseRepository;
import com.elearning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")  // Allow frontend access from any domain/port
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    // ✅ GET total stats (already implemented)
    @GetMapping("/admin/stats")
    public Map<String, Long> getStats() {
        long userCount = userRepository.count();      
        long courseCount = courseRepository.count();   

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userCount);
        stats.put("totalCourses", courseCount);

        return stats;
    }

    // ✅ GET all users
    @GetMapping("/admin/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ DELETE user by ID
    @DeleteMapping("/admin/delete-user/{id}")
    public String deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return "User deleted successfully";
    }
    @GetMapping("/courses/add")
    public String showAddCoursePage(Model model) {
        model.addAttribute("course", new Course());
        return "add-course";
    }

}
