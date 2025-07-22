
document.addEventListener("DOMContentLoaded", () => {
 const loadComponent = async (id, file) => {
  try {
    const res = await fetch(file);
    const html = await res.text();
    const container = document.getElementById(id);
    container.innerHTML = html;

  
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    tempDiv.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");

     
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }

      document.body.appendChild(newScript); 
    });
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
};

  loadComponent("navbar-placeholder", "navbar.html");
  loadComponent("footer-placeholder", "footer.html");

  function showPopup(message, isSuccess = true) {
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.padding = "15px 25px";
    popup.style.backgroundColor = isSuccess ? "#28a745" : "#dc3545";
    popup.style.color = "#fff";
    popup.style.fontSize = "16px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
    popup.style.zIndex = "10000";

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
  }

  function renderCourses(courses, container, limit = courses.length) {
    container.innerHTML = "";
    const shownCourses = courses.slice(0, limit);

    shownCourses.forEach((course) => {
      const imageUrl = course.thumbnail?.trim();
      const rating = course.rating || 0;
      const fullStars = Math.floor(rating);
      const starIcons = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);

      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="Course Image">` : ""}
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>Instructor:</strong> ${course.instructor || "N/A"}</p>
        <p><strong>Price:</strong> ₹${course.price || "0"}</p>
        <div class="course-rating">${starIcons}</div>
        <a href="course-detail.html?id=${course.id}" class="btn">View Details</a>
      `;
      container.appendChild(card);
    });
  }

  const courseContainer = document.getElementById("course-container");
  const isHomePage =
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/";
  const isCoursesPage = window.location.pathname.includes("courses.html");

  if (isHomePage && courseContainer) {
    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((courses) => {
        let visibleCount = 8;
        renderCourses(courses, courseContainer, visibleCount);

        const seeMoreBtn = document.getElementById("see-more-btn");
        if (seeMoreBtn) {
          seeMoreBtn.addEventListener("click", () => {
            renderCourses(courses, courseContainer);
            seeMoreBtn.style.display = "none";
          });
        }
      })
      .catch((err) => {
        console.error("Home Page: Failed to load courses", err);
        courseContainer.innerHTML = "<p>Error loading courses.</p>";
      });
  }

  if (isCoursesPage && courseContainer) {
    fetch("http://localhost:8080/api/courses")
      .then((res) => res.json())
      .then((courses) => {
        renderCourses(courses, courseContainer);

        const searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.addEventListener("input", () => {
            const keyword = searchInput.value.toLowerCase();
            const allCards = document.querySelectorAll(".course-card");

            allCards.forEach((card) => {
              const title = card.querySelector("h3")?.textContent.toLowerCase();
              const instructor = card.innerHTML.toLowerCase();
              card.style.display =
                title.includes(keyword) || instructor.includes(keyword)
                  ? "block"
                  : "none";
            });
          });
        }
      })
//       
  }

  const isCourseDetailPage = window.location.pathname.includes("course-detail.html");

  if (isCourseDetailPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");

    if (courseId) {
      fetch(`http://localhost:8080/api/courses/${courseId}`)
        .then((res) => res.json())
        .then((course) => {
          if (!course || Object.keys(course).length === 0) {
            document.querySelector(".container").innerHTML = "<h2>Course not found.</h2>";
            return;
          }

         
          document.querySelector(".course-title").textContent = course.title || "Untitled";
          document.querySelector(".course-description").textContent = course.description || "No description.";
          document.querySelector(".course-instructor").textContent = course.instructor || "N/A";
          document.querySelector(".course-duration").textContent = course.duration || "N/A";
          document.querySelector(".course-updated").textContent = course.lastUpdated || "N/A";
          document.querySelector(".course-language").textContent = course.language || "N/A";
          document.querySelector(".course-requirements").textContent = course.requirements || "None";

          const rating = course.rating || 0;
          const stars = "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
          document.querySelector(".course-rating").textContent = stars;

         
          const learnList = course.whatYouWillLearn || [];
          const ul = document.querySelector(".course-what-you-learn");
          ul.innerHTML = learnList.length
            ? learnList.map((item) => `<li>${item}</li>`).join("")
            : "<li>No learning outcomes defined.</li>";

          const imageEl = document.querySelector(".course-image");
          if (imageEl && course.thumbnail) {
            imageEl.src = course.thumbnail;
            imageEl.style.display = "block";
          }

          const videoLinkEl = document.querySelector(".course-video-link");
          const embeddedLink = course.videoLink?.includes("watch?v=")
            ? course.videoLink.replace("watch?v=", "embed/")
            : course.videoLink;

          if (videoLinkEl && embeddedLink) {
            videoLinkEl.innerHTML = `
              <h3>Course Intro Video</h3>
              <iframe src="${embeddedLink}" allowfullscreen></iframe>
            `;
          }

          
          const watchBtn = document.querySelector(".watch-preview-btn");
          const modal = document.getElementById("video-modal");
          const closeBtn = document.querySelector(".close-btn");
          const videoFrame = document.getElementById("video-frame");

          if (watchBtn && modal && closeBtn && videoFrame && embeddedLink) {
            watchBtn.addEventListener("click", () => {
              videoFrame.src = embeddedLink;
              modal.style.display = "block";
            });

            closeBtn.addEventListener("click", () => {
              modal.style.display = "none";
              videoFrame.src = "";
            });

            window.addEventListener("click", (e) => {
              if (e.target === modal) {
                modal.style.display = "none";
                videoFrame.src = "";
              }
            });
          }

          const enrollBtn = document.querySelector(".enroll-btn");
          if (enrollBtn) {
            enrollBtn.addEventListener("click", () => {
              showPopup("🎉 You have enrolled in this course!", true);
            });
          }

   
          const moduleList = document.querySelector(".module-list");
          if (moduleList) {
            const modules = course.modules || [];
            if (modules.length) {
              moduleList.innerHTML = "";
              modules.forEach((m, i) => {
                const modDiv = document.createElement("div");
                modDiv.className = "module-card";
                modDiv.innerHTML = `Course ${i + 1}: <strong>${m.title}</strong><br>• ${m.duration}`;
                moduleList.appendChild(modDiv);
              });
            } else {
              moduleList.innerHTML = "<p>No modules available.</p>";
            }
          }

         
          const reminderBtn = document.getElementById("set-reminder-btn");
          if (reminderBtn) {
            reminderBtn.addEventListener("click", () => {
              const timeInput = document.getElementById("reminder-time").value;
              if (!timeInput) {
                alert("Please select a time for the reminder.");
                return;
              }

              const selectedTime = new Date(timeInput);
              const currentTime = new Date();
              const delay = selectedTime.getTime() - currentTime.getTime();

              if (delay <= 0) {
                alert("Please select a future time.");
                return;
              }

              setTimeout(() => {
                alert("🔔 Reminder: Time to continue your course!");
              }, delay);

              alert("⏰ Reminder is set successfully!");
            });
          }
        })
        .catch((err) => {
          console.error("Failed to load course detail:", err);
          document.querySelector(".container").innerHTML =
            "<h2>Failed to load course details.</h2>";
        });
    }
  }


  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const response = await fetch("http://localhost:8080/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
          showPopup("🎉 Registered Successfully!", true);
          localStorage.setItem("registeredEmail", email);
          setTimeout(() => (window.location.href = "login.html"), 2000);
        } else {
          const errText = await response.text();
          showPopup("❌ Registration Failed: " + errText, false);
        }
      } catch (err) {
        console.error("Error:", err);
        showPopup("⚠️ Something went wrong while registering!", false);
      }
    });
  }


  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:8080/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const user = await response.json();
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          showPopup("✅ Login successful!", true);
          setTimeout(() => (window.location.href = "index.html"), 1500);
        } else {
          const msg = await response.text();
          showPopup("❌ Login failed: " + msg, false);
        }
      } catch (err) {
        console.error("Login error:", err);
        showPopup("⚠️ Something went wrong during login!", false);
      }
    });

    const savedEmail = localStorage.getItem("registeredEmail");
    if (savedEmail) {
      document.getElementById("email").value = savedEmail;
    }
  }
});
