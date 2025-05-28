import Stripe from "stripe";

import { db } from "@/app/lib/firebase";

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
  const customerId = event.data.object.customer

  const userRef = await db.collection("users").where("stripeCustomerId", "==", customerId).get()

  if (userRef.empty) {
    console.log("User not found")
    return
  }

  const userId = userRef.docs[0].id

  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive"
  })
}