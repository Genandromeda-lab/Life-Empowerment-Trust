// ================================
// Success Stories Page Script
// ================================

document.addEventListener("DOMContentLoaded", () => {
  // Highlight the active nav link
  const navLinks = document.querySelectorAll("nav a");
  const currentPath = window.location.pathname.split("/").pop();
  navLinks.forEach(link => {
    if (link.getAttribute("href").includes(currentPath)) {
      link.classList.add("active");
    }
  });

  // Animate milestones when they come into view
  const milestoneItems = document.querySelectorAll(".milestones li");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  milestoneItems.forEach(item => observer.observe(item));

  // Optional: hover effect for mentor image
  const mentorImg = document.querySelector(".mentor img");
  if (mentorImg) {
    mentorImg.addEventListener("mouseenter", () => {
      mentorImg.style.transform = "scale(1.05)";
      mentorImg.style.transition = "transform 0.3s ease";
    });
    mentorImg.addEventListener("mouseleave", () => {
      mentorImg.style.transform = "scale(1)";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".main-nav ul");

  toggleBtn.addEventListener("click", () => {
    navList.classList.toggle("show");
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");

    // Toggle icon between ☰ and ✖
    if (nav.classList.contains("open")) {
      menuToggle.textContent = "✖";
    } else {
      menuToggle.textContent = "☰";
    }
  });
});