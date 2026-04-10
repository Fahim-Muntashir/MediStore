// src/modules/admin/admin.route.ts
import express, { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { AdminController } from "./admin.controller";
import { upload } from "../../middlewares/upload";

const router = express.Router();

router.get("/dashboard", auth(UserRole.ADMIN), AdminController.getDashboard);

router.get("/users", auth(UserRole.ADMIN), AdminController.getUsers);

router.put("/users/:id", auth(UserRole.ADMIN), AdminController.updateUser);

router.delete("/users/:id", auth(UserRole.ADMIN), AdminController.deleteUser);

// Orders
router.get("/orders", auth(UserRole.ADMIN), AdminController.getOrders);
router.put(
  "/orders/:id/status",
  auth(UserRole.ADMIN),
  AdminController.updateOrderStatus,
);

// Categories
router.get("/categories", AdminController.getCategories);
router.post(
  "/categories",
  auth(UserRole.ADMIN),
  upload.single("image"),
  AdminController.createCategory
);
router.put(
  "/categories/:id", 
  auth(UserRole.ADMIN), 
  upload.single("image"),
  AdminController.updateCategory
);
router.delete(
  "/categories/:id",
  auth(UserRole.ADMIN),
  AdminController.deleteCategory,
);

export const adminRouter: Router = router;
