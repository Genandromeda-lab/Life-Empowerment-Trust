// ================================
// Programs Page Carousel Script
// ================================

// For each carousel on the page, cycle through images
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {
    const images = carousel.querySelectorAll("img");
    let currentIndex = 0;

    // Function to show a specific image
    function showImage(index) {
      images.forEach((img, i) => {
        img.classList.remove("active");
        if (i === index) {
          img.classList.add("active");
        }
      });
    }

    // Auto-play every 4 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }, 4000);

    // Optional: click on image to go to next
    images.forEach(img => {
      img.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
    });

    // Initialize
    showImage(currentIndex);
  });
});