// ================================
// Homepage Carousel Script
// ================================

// Select all slides and navigation buttons
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;

// Function to show a slide by index
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

// Function to go to next slide
function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

// Function to go to previous slide
function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}

// Event listeners for buttons
if (nextBtn) nextBtn.addEventListener("click", nextSlide);
if (prevBtn) prevBtn.addEventListener("click", prevSlide);

// Auto-play every 5 seconds
setInterval(nextSlide, 5000);

// Initialize carousel on page load
document.addEventListener("DOMContentLoaded", () => {
  showSlide(currentIndex);
});



// ================================
// Notification Button Script
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const notifyBtn = document.getElementById("notify-btn");

  if (notify-btn) {
    notifyBtn.addEventListener("click", async () => {
      // Ask browser for notification permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // Show a browser notification
        new Notification("✅ Notifications enabled! You’ll get updates and upcoming events instantly.");

        // Update button text and style
        notifyBtn.innerText = "✅ Notifications Enabled";
        notifyBtn.classList.add("enabled");
        notifyBtn.disabled = true; // prevent further clicks
      } else {
        alert("❌ Notifications blocked. Please allow them in your browser settings.");
      }
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