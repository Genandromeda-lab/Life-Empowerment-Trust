// ================================
// About Us Page Script
// ================================

// Highlight the active nav link based on current URL
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  const currentPath = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// Smooth scroll for internal anchors (like #about-us)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Optional: Expand/collapse timeline items
const timelineItems = document.querySelectorAll(".timeline li");
timelineItems.forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("expanded");
  });
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