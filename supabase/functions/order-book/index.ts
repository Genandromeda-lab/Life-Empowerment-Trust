import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

serve(async (req: Request) => {
  // ✅ Handle CORS preflight
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
    const { name, email, address, copies } = await req.json();

    console.log("Incoming order:", { name, email, address, copies });

    const { error } = await supabase
      .from("orders")
      .insert([{ name, email, address, copies }]);

    console.log("Insert result:", error);

    if (error) throw error;

    // Customer confirmation email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Book Order Confirmation",
      html: `
        <p>Dear ${name},</p>
        <p>Your order for <b>${copies} copies</b> has been received.</p>
        <p>We’ll notify you when it ships.</p>
      `,
    });

    // Internal notification email to trust inbox
    await resend.emails.send({
      from: "lifeempowermenttrust.org",
      to: "lifeempowermenttrust@gmail.com",
      subject: "New Book Order Received",
      html: `
        <p>A new book order has been placed:</p>
        <ul>
          <li><b>Name:</b> ${name}</li>
          <li><b>Email:</b> ${email}</li>
          <li><b>Address:</b> ${address}</li>
          <li><b>Copies:</b> ${copies}</li>
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
    console.error("Error processing order:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});

