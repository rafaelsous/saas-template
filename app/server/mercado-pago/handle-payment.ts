import resend from "@/app/lib/resend";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  const metadata = paymentData.metadata
  const userEmail = metadata?.user_email
  
  const { data, error } = await resend.emails.send({
    from: 'Acme <me@rafaelsousa.dev.br>',
    to: [userEmail],
    subject: 'Welcome',
    text: "Payment has been made successful",
  });

  if (error) {
    console.log(error)
  }

  console.log(data)
}
