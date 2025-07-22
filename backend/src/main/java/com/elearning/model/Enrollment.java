package com.elearning.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "enrollments")
public class Enrollment {

    @Id
    private String id;
    private String userId;
    private String courseId;
    private Date enrolledOn;

    
    public Enrollment() {}

    public Enrollment(String userId, String courseId, Date enrolledOn) {
        this.userId = userId;
        this.courseId = courseId;
        this.enrolledOn = enrolledOn;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public Date getEnrolledOn() {
        return enrolledOn;
    }

    public void setEnrolledOn(Date enrolledOn) {
        this.enrolledOn = enrolledOn;
    }
}