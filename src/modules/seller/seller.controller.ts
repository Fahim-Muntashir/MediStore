import { Request, Response, NextFunction } from "express";
import { sellerService } from "./seller.service";

const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user?.id!;
    const dashboard = await sellerService.getDashboard(sellerId);
    res.status(200).json(dashboard);
  } catch (err) {
    next(err);
  }
};

const getMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user?.id!;
    console.log(sellerId);
    const medicines = await sellerService.getMedicines(sellerId);
    res.status(200).json(medicines);
  } catch (err) {
    next(err);
  }
};

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user?.id!;
    const medicine = await sellerService.createMedicine(req.body, sellerId);
    res.status(201).json(medicine);
  } catch (err) {
    next(err);
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.id!;
    const medicine = await sellerService.updateMedicine(
      id as string,
      req.body,
      sellerId,
    );
    res.status(200).json(medicine);
  } catch (err) {
    next(err);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.id!;
    await sellerService.deleteMedicine(id as string, sellerId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user?.id!;
    const orders = await sellerService.getOrders(sellerId);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const sellerId = req.user?.id!;
    const order = await sellerService.updateOrderStatus(
      id as string,
      sellerId,
      status,
    );
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const SellerController = {
  getDashboard,
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getOrders,
  updateOrderStatus,
};
