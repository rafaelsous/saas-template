import { Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

import { mpClient } from "@/app/lib/mercado-pago";

export async function POST(req: NextRequest) {
  const { testId, userEmail } = await req.json()

  try {
    const preference = new Preference(mpClient)

    const createdPreference = await preference.create({
      body: {
        external_reference: testId, // Impacta na pontuação do Mercado Pago
        metadata: {
          testId, // O nome da variável é convertido para snake_case -> test_id
        },
        ...(userEmail && { payer: { email: userEmail } }), // Também impacta na pontuação
        items: [
          {
            id: "",
            description: "",
            title: "",
            quantity: 1,
            unit_price: 1,
            currency_id: "BRL",
            category_id: "services",
          },
        ],
        // payment_methods: {
        //   installments: 12,
        //   excluded_payment_methods: [
        //     { id: "bolbradesco" },
        //     { id: "pec" },
        //   ],
        // },
        auto_return: "approved",
        back_urls: {
          success: `${req.headers.get("origin")}/api/mercado-pago/peding`,
          failure: `${req.headers.get("origin")}/api/mercado-pago/peding`,
          pending: `${req.headers.get("origin")}/api/mercado-pago/peding`,
        }
      },
    })

    if (!createdPreference.id) {
      return NextResponse.json({ error: "Error creating checkout with Mercado Pago" }, { status: 500 })
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Error creating checkout with Mercado Pago" }, { status: 500 })
  }
}