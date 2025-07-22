package com.elearning.controller;
import com.elearning.model.Course;
import com.elearning.repository.CourseRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*") 
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

   
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id);
            Course course = courseRepository.findById(objectId.toHexString()).orElse(null);
            if (course == null) {
                return ResponseEntity.status(404).body("Course not found");
            }
            return ResponseEntity.ok(course);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid course ID format");
        }
    }

    
    @PostMapping("/add")
    public ResponseEntity<?> handleFormSubmission(@ModelAttribute Course course) {
        try {
            courseRepository.save(course);
            return ResponseEntity.ok("Course added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add course: " + e.getMessage());
        }
    }
}