import { Request, Response } from "express";
import Stripe from "stripe";
import { customerService } from "../customer/customer.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderIds = JSON.parse(session.metadata?.orderIds || "[]");
    
    if (orderIds.length > 0) {
      await customerService.handlePaymentSuccess(orderIds);
      console.log(`Orders ${orderIds.join(", ")} marked as PLACED via webhook.`);
    }
  }

  res.json({ received: true });
};
