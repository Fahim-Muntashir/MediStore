import { Request, Response, NextFunction } from "express";
import { customerService } from "./customer.service";

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
    const order = await customerService.placeOrder(userId, req.body);
    res.status(201).json(order);
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
