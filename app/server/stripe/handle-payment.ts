import "server-only"

import { db } from "@/app/lib/firebase";

import Stripe from "stripe";
import resend from "@/app/lib/resend";
import { EmailTemplate } from "@/app/components/email-template";

export async function handleStripePayment(event: Stripe.CheckoutSessionCompletedEvent) {
  if (event.data.object.payment_status === "paid") {
    const metadata = event.data.object.metadata
    const userId = metadata?.userId
    const userEmail = event.data.object.customer_email
    const username = event.data.object.customer_details?.name

    if (!userId || !userEmail || !username) {
      console.log("User ID or email not found")
      return
    }

    await db.collection("users").doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active"
    })

    const { data, error } = await resend.emails.send({
      from: 'Acme <me@rafaelsousa.dev.br>',
      to: [userEmail],
      subject: 'Welcome',
      react: EmailTemplate({ firstName: username }),
    });

    if (error) {
      console.log(error)
    }

    console.log(data)
  }
}