"use client"

import { useStripe } from "@/app/hooks/useStripe"

export default function Payments() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    createStripePortal
  } = useStripe()

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-10 text-4xl font-bold">Payments Page</h1>

      <div className="flex flex-col gap-4">
        <button
          className="w-68 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-200"
          onClick={() => createPaymentStripeCheckout({
            testId: "123"
          })}
        >
          Create Stripe Payment
        </button>

        <button
          className="w-68 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-200"
          onClick={() => createSubscriptionStripeCheckout({
            testId: "123"
          })}
        >
          Create Stripe Subscription
        </button>

        <button
          className="w-68 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-200"
          onClick={createStripePortal}
        >
          Create Stripe Portal
        </button>
      </div>
    </div>
  )
}