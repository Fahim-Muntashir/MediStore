import { Request, Response, NextFunction } from "express";
import { customerService } from "./customer.service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id!;
    const cart = await customerService.getCart(userId);
    console.log(cart);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

const getCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id!;
    const checkout = await customerService.getCheckout(userId);
    res.status(200).json(checkout);
  } catch (err) {
    next(err);
  }
};
const leaveReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const rawOrderId = req.params.orderId;
    const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

    if (!orderId) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const { medicineId, rating, comment } = req.body;

    if (!medicineId || rating == null) {
      return res.status(400).json({
        error: "Medicine ID and rating are required",
      });
    }

    const review = await customerService.leaveReview(userId, orderId, {
      medicineId: String(medicineId),
      rating: Number(rating),
      comment: comment ?? null,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};
const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    const userId = req.user?.id!;
    const orders = await customerService.placeOrder(userId, req.body);
    
    if (req.body.paymentMethod === "online") {
      const line_items: any[] = [];
      
      orders.forEach((order) => {
        order.items.forEach((item) => {
          line_items.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.medicine.name,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          });
        });
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.APP_URL || "http://localhost:3000"}/dashboard/my-orders?success=true`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/checkout?canceled=true`,
        metadata: {
          orderIds: JSON.stringify(orders.map((o) => o.id)),
        },
      });

      return res.status(201).json({ url: session.url, orders });
    }

    res.status(201).json({ orders });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id!;
    const orders = await customerService.getOrders(userId);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id!;
    const orderId = req.params.id;
    if (!orderId) return res.status(400).json({ error: "Invalid order ID" });

    const order = await customerService.getOrderById(userId, orderId as string);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id!;

    console.log("heelo");
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cartItem = await customerService.addToCart(
      userId,
      productId,
      quantity || 1,
    );

    res.status(201).json(cartItem);
  } catch (err) {
    next(err);
  }
};

export const CustomerController = {
  getCart,
  getCheckout,
  placeOrder,
  getOrders,
  getOrderById,
  addToCart,
  leaveReview,
};
