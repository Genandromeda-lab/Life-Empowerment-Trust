import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Supabase client with service role key
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Resend client for emails
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { name, email, amount, image } = await req.json();

    if (!name || !email || !amount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const { data, error } = await supabase
      .from("donations")
      .insert([{ name, email, amount, image }]);

    console.log("Insert result:", data, error);
    if (error) throw error;

    // ✅ Confirmation email to donor
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Thank you for your donation!",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for donating ₹${amount}. Your support empowers our mission at Life Empowerment Trust.</p>
        ${image ? `<p>✅ Payment proof received.</p>` : ""}
      `,
    });

    // ✅ Internal notification email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "lifeempowermenttrust@gmail.com",
      subject: "New Donation Received",
      html: `
        <p>A new donation has been received:</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Amount:</b> ₹${amount}</li>
          <li><b>Image:</b> ${image ? "✅ Provided" : "—"}</li>
        </ul>
      `,
    });

    return new Response("Success", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});

