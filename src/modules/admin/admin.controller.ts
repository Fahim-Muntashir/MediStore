// src/modules/admin/admin.controller.ts
import { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service";

export const AdminController = {
  getDashboard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dashboard = await adminService.getDashboard();
      res.status(200).json(dashboard);
    } catch (err) {
      next(err);
    }
  },

  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await adminService.getUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await adminService.updateUser(id as string, req.body);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteUser(id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  getOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await adminService.getOrders();
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  },

  updateOrderStatus: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await adminService.updateOrderStatus(id as string, status);
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  },

  getCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await adminService.getCategories();
      res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  },

  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const category = await adminService.createCategory(name);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  },

  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await adminService.updateCategory(id as string, name);
      res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  },

  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await adminService.deleteCategory(id as string);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
