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

const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id!;
    const profile = await customerService.getProfile(userId);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id!;
    const profile = await customerService.updateProfile(userId, req.body);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id!;
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
  getProfile,
  updateProfile,
  addToCart,
};
