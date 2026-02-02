import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { SellerController } from "./seller.controller";

const router = Router();

router.get("/dashboard", SellerController.getDashboard);

router.get("/medicines", auth(UserRole.SELLER), SellerController.getMedicines);

router.post("/medicines", SellerController.createMedicine);

router.put("/medicines/:id", SellerController.updateMedicine);

router.delete("/medicines/:id", SellerController.deleteMedicine);

router.get("/orders", SellerController.getOrders);

router.put("/orders/:id", SellerController.updateOrderStatus);

export const sellerRouter = router;
