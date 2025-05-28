import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/app/lib/stripe";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel-subscription";

const secret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headerList = await headers()
    const signature = headerList.get("stripe-signature")

    if (!signature || !secret) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret)

    switch (event.type) {
      case "checkout.session.completed": // Pagamento feito se status = paid
        const metadata = event.data.object.metadata

        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event)
        }

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event)
        }

        break;
      case "checkout.session.expired": // Tempo de pagamento expirado
        console.log("Send email to user notifying that payment expired")
        break;
      case "checkout.session.async_payment_succeeded": // Boleto pago
        console.log("Send email to user notifying that the payment has been made")
        break;
      case "checkout.session.async_payment_failed": // Boleto falhou
        console.log("Send email to user notifying that payment failed")
        break;
      case "customer.subscription.created": // Assinatura criada
        console.log("Send welcome message for subscribing")
        break;
      case "customer.subscription.deleted": // Assinatura cancelada
        await handleStripeCancelSubscription(event)
        break;
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}