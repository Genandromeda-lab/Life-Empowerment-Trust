// ================================
// Contact Page Script
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://prjfrzjszvttomjoxxvc.supabase.co"; // Supabase project URL
  const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamZyempzenZ0dG9tam94eHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDcwNDQsImV4cCI6MjA4MDE4MzA0NH0.J3n1P1j1jgr50YkNLdwHb471lxKFfjmgJFl4h5MSVrc"; // Supabase anon key

  // ================================
  // General Inquiry Form
  // ================================
  const inquiryForm = document.getElementById("inquiry-form");
  const inquiryConfirmation = document.getElementById("inquiry-confirmation");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(inquiryForm));

      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/general-inquiry`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          inquiryForm.style.display = "none";
          inquiryConfirmation.textContent =
            "✅ Thank you for reaching out! We will respond to your inquiry soon.";
        } else {
          inquiryConfirmation.textContent = "❌ Something went wrong. Please try again.";
        }
      } catch (err) {
        inquiryConfirmation.textContent = "⚠️ Error: " + err.message;
      }
    });
  }

  // ================================
  // Book Order Form
  // ================================
  const bookForm = document.getElementById("book-form");
  const bookConfirmation = document.getElementById("book-confirmation");

  if (bookForm) {
    bookForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(bookForm));

      // Ensure numeric conversion for copies
      if (data.copies) data.copies = parseInt(data.copies, 10);

      const submitBtn = bookForm.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;
      bookConfirmation.textContent = "⏳ Processing your order...";

      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/order-book`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ANON_KEY}`, // keep if function requires auth
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          bookForm.style.display = "none";
          bookConfirmation.textContent =
            "📚 Thank you for ordering 'Oorukku Oru Kudi'! Our team will contact you with delivery details.";
        } else {
          const err = await res.json();
          bookConfirmation.textContent = `❌ Error: ${err.error || "Request failed"}`;
        }
      } catch (err) {
        bookConfirmation.textContent = `⚠️ Network error: ${err.message}`;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
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


const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const { name, email, message } = JSON.parse(event.body);

  try {
    // 1️⃣ Notification email to you
    await resend.emails.send({
      from: 'Life Empowerment Trust <noreply@lifeempowermenttrust.org>',
      to: 'lifeempowermenttrust@gmail.com',
      subject: 'New Form Submission',
      html: `<p><strong>${name}</strong> (${email}) says:</p><p>${message}</p>`,
    });

    // 2️⃣ Thank-you email to donor/visitor
    await resend.emails.send({
      from: 'Life Empowerment Trust <noreply@lifeempowermenttrust.org>',
      to: email,
      subject: 'Thank You from Life Empowerment Trust',
      html: `<p>Dear ${name},</p>
             <p>Thank you for reaching out / donating. Your support means a lot to us!</p>
             <p>Warm regards,<br>Life Empowerment Trust Team</p>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};