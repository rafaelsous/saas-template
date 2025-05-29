import Stripe from "stripe";

import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
  const customerId = event.data.object.customer

  const userRef = await db.collection("users").where("stripeCustomerId", "==", customerId).get()

  if (userRef.empty) {
    console.log("User not found")
    return
  }

  const userId = userRef.docs[0].id
  const userEmail = userRef.docs[0].data().email

  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive"
  })

  const { data, error } = await resend.emails.send({
    from: 'Acme <me@rafaelsousa.dev.br>',
    to: [userEmail],
    subject: 'Subscription cancelled',
    text: "Your subscription has been cancelled",
  });

  if (error) {
    console.log(error)
  }

  console.log(data)
}