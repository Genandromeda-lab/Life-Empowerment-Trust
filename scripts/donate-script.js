document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const donationForm = document.getElementById("donation-form");
  const thankYouMessage = document.getElementById("thank-you-message");
  const tiersContainer = document.querySelector(".donation-tiers");
  const amountField = document.getElementById("donation-amount");

  // ✅ Tier selection (click + keyboard)
  if (tiersContainer) {
    const selectTier = (tierEl) => {
      const amt = tierEl.getAttribute("data-amount");
      if (amountField) amountField.value = amt;
      tiersContainer.querySelectorAll(".tier").forEach(t => t.classList.remove("selected"));
      tierEl.classList.add("selected");
    };

    tiersContainer.addEventListener("click", (e) => {
      const tier = e.target.closest(".tier");
      if (tier) selectTier(tier);
    });

    tiersContainer.addEventListener("keydown", (e) => {
      const tier = e.target.closest(".tier");
      if (!tier) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectTier(tier);
      }
    });
  }

  // ✅ Supabase client
  const SUPABASE_URL = "https://prjfrzjszvttomjoxxvc.supabase.co"; // your project URL
  const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamZyempzenZ0dG9tam94eHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDcwNDQsImV4cCI6MjA4MDE4MzA0NH0.J3n1P1j1jgr50YkNLdwHb471lxKFfjmgJFl4h5MSVrc"; // replace with your anon key from Supabase dashboard
  if (!window.supabase) {
    console.error("Supabase library not loaded. Include CDN in <head>.");
    return;
  }
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // ✅ Handle donation form submission
  donationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const donorName = e.target.name?.value.trim();   // matches table column "name"
    const donorEmail = e.target.email?.value.trim(); // matches table column "email"
    const amount = Number(e.target.amount?.value);   // matches table column "amount"
    const file = e.target.image?.files[0];           // matches table column "image"

    if (!donorName || !donorEmail || !amount) {
      alert("⚠ Please fill in all required fields.");
      return;
    }

    const submitBtn = donationForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    let imageUrl = null;



    try {
      // Step 1: Upload file to Supabase Storage (public bucket)
      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("donation-proofs")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          alert("❌ File upload failed. Please try again.");
          throw uploadError;
        }

        // Permanent public URL
        imageUrl = `https://prjfrzjszvttomjoxxvc.supabase.co/storage/v1/object/public/donation-proofs/${fileName}`;
        console.log("✅ File uploaded:", uploadData);
      }

      // Step 2: Call Edge Function to insert donor info + send email
      const response = await fetch(`https://prjfrzjszvttomjoxxvc.supabase.co/functions/v1/submit-form`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${SUPABASE_ANON}` // ✅ Add this line
  },
  body: JSON.stringify({ name: donorName, email: donorEmail, amount, image: imageUrl })
});

      const text = await response.text();
      if (!response.ok) {
        console.error("Edge Function error:", response.status, text);
        alert("⚠ Donation saved/uploaded, but backend processing failed.");
        throw new Error(text);
      }

      console.log("✅ Edge Function success:", text);

      // Step 3: Show confirmation
      donationForm.style.display = "none";
      thankYouMessage.style.display = "block";

    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Something went wrong. Please check the console for details.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Donation Proof";
    }
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