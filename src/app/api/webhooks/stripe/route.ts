import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

function getStripe(): Stripe {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return new Stripe(process.env.STRIPE_WEBHOOK_SECRET, {
    apiVersion: Stripe.API_VERSION,
  });
}

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email ?? "";
    const name = session.customer_details?.name ?? "";
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const plan = session.metadata?.plan ?? "unknown";
    const status = session.payment_status ?? "unknown";
    const stripeSessionId = session.id;

    // Store in Supabase
    const supabase = getSupabase();
    const { error: dbError } = await supabase.from("payments").insert({
      email,
      name,
      plan,
      amount,
      status,
      stripe_session_id: stripeSessionId,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    // Send confirmation email via Resend
    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL ?? "MediaFix <noreply@resend.dev>",
          to: [email],
          subject: "Your MediaFix files are ready",
          html: `
            <h1>Thank you for your purchase!</h1>
            <p>Hi ${name || "there"},</p>
            <p>Your MediaFix <strong>${plan}</strong> purchase of <strong>$${amount.toFixed(2)}</strong> was successful.</p>
            <p>You can return to MediaFix anytime to process your files:</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://mediafix.tools"}">Open MediaFix</a></p>
            <p>Questions? Reply to this email.</p>
            <p>— The MediaFix Team</p>
          `,
        }),
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error("Resend error:", errText);
      }
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.error("Payment failed:", pi.id, pi.last_payment_error?.message);
  }

  return NextResponse.json({ received: true });
}
