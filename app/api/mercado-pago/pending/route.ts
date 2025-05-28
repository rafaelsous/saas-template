import { Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

import { mpClient } from "@/app/lib/mercado-pago";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");
    const testId = searchParams.get("external_reference");
    
    if (!paymentId || !testId) {
      return NextResponse.json({ error: "Payment ID and test ID are required" }, { status: 400 });
    }

    const payment = new Payment(mpClient);
    const paymentInfo = await payment.get({
      id: paymentId,
    });

    if (paymentInfo.status === "approved" || paymentInfo.date_approved !== null) {
      return NextResponse.redirect(new URL(`success`, req.url));
    }

    return NextResponse.redirect(new URL(`/`, req.url));
}