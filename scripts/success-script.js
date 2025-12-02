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