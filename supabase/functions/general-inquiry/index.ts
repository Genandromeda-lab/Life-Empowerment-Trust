import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { name, email, message } = await req.json();

    // Insert into Supabase
    const { error } = await supabase
      .from("inquiries")
      .insert([{ name, email, message }]);

    if (error) throw error;

    // Customer confirmation email
    await resend.emails.send({
      from:"lifeempowermenttrust.org",
      to: email,
      subject: "Inquiry Received",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out. We have received your inquiry:</p>
        <blockquote>${message}</blockquote>
        <p>Our team will respond shortly.</p>
      `,
    });

    // Internal notification email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "lifeempowermenttrust@gmail.com",
      subject: "New Inquiry Received",
      html: `
        <p>A new inquiry has been submitted:</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Message:</b> ${message}</li>
        </ul>
      `,
    });

    return new Response(JSON.stringify({ status: "success" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});