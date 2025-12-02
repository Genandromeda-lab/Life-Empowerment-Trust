// ================================
// Media & Publications Page Script
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

  // Animate cards when they come into view
  const cards = document.querySelectorAll(".card");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));

  // Handle Order Book button (if present)
  const orderBtn = document.querySelector(".book .cta-button");
  if (orderBtn) {
    orderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "contact.html#book-order";
    });
  }
});